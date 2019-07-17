package com.mkdemo.erp.sys.impl;

import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.alibaba.dubbo.config.annotation.Reference;
import com.alibaba.dubbo.config.annotation.Service;
import com.google.common.io.Files;
import com.mk.eap.common.domain.FileDto;
import com.mk.eap.component.oid.itf.IOidService;
import com.mk.eap.entity.dto.ComposFieldDto;
import com.mk.eap.entity.dto.InjectorConfig;
import com.mk.eap.entity.dto.PageQueryDto;
import com.mk.eap.entity.impl.EntityCompositionInjector;
import com.mk.eap.entity.impl.EntityReflectionInjector;
import com.mk.eap.entity.impl.EntityServiceImpl;
import com.mk.eap.entity.utils.QueryPageListUtil;
import com.mkdemo.erp.sys.dao.SysEntityMapper;
import com.mkdemo.erp.sys.dto.SysEntityDto;
import com.mkdemo.erp.sys.dto.SysEntityFieldDto;
import com.mkdemo.erp.sys.dto.SysEntityGroupDto;
import com.mkdemo.erp.sys.itf.ISysEntityFieldService;
import com.mkdemo.erp.sys.itf.ISysEntityGroupService;
import com.mkdemo.erp.sys.itf.ISysEntityService;
import com.mkdemo.erp.sys.utils.CodeMeta;
import com.mkdemo.erp.sys.utils.CodeTemplateUtil;
import com.mkdemo.erp.sys.utils.ZipUtil;
import com.mkdemo.erp.sys.vo.SysEntityVo;

/**
 * @Title: SysEntityServiceImpl.java
 * @Package: com.mkdemo.erp.sys.impl
 * @Description: 实体接口实现类
 * @version 1.0
 * 
 *          <p>
 *          实体接口实现类
 *          </p>
 * 
 * @author lsg
 * 
 */
@Component
@Service
public class SysEntityServiceImpl extends EntityServiceImpl<SysEntityDto, SysEntityVo, SysEntityMapper>
		implements ISysEntityService {

	// Logger log = LoggerFactory.getLogger(SysSysWebsiteServiceImpl.class);

	@Autowired
	private ISysEntityGroupService entityGroupService;

	@Autowired
	private ISysEntityFieldService entityFieldService;

	@Reference
	private IOidService idService;

	@Override
	protected void setObjectKeyValue(SysEntityDto createDto) {
		if (createDto.getId() == null) {
			createDto.setId(idService.generateObjectID());
		}
	}

	@Override
	protected void beforeQueryPageList(PageQueryDto<SysEntityDto> queryDto, InjectorConfig cfg) {
		super.beforeQueryPageList(queryDto, cfg);

		if (queryDto.getFilter() == null || queryDto.getExample() != null) {
			return;
		} 
		if (queryDto.getSearchFields() == null) {
			String[] searchFields = new String[] { "name","code"};
			queryDto.setSearchFields(searchFields);
			QueryPageListUtil.advanceSearch(queryDto, searchFields, SysEntityVo.class);
		}  
	}

	@Override
	public SysEntityDto createByTableName(String packageName, String dbName, String tableName) {
		SysEntityDto dto = this.loadEntityByTableName(packageName, dbName, tableName);
		return this.create(dto);
	}

	@Override
	public FileDto genCodeByTableName(String packageName, String dbName, String tableName) throws Exception {
		SysEntityDto dto = this.loadEntityByTableName(packageName, dbName, tableName);
		return genCodeByDto(dto);
	}

	public SysEntityServiceImpl() {
		super();
		this.getInjectors().add(fieldsInjector());
		this.getInjectors().add(entityGroupInjector());
	}

	private EntityReflectionInjector<SysEntityDto, SysEntityGroupDto> entityGroupInjector() {
		return new EntityReflectionInjector<>("entityGroup", "entityGroupId", SysEntityGroupDto.class,
				() -> entityGroupService);
	}

	private EntityCompositionInjector<SysEntityDto, SysEntityFieldDto> fieldsInjector() {
		return new EntityCompositionInjector<>("fields", "entityId", SysEntityFieldDto.class, () -> entityFieldService);
	}

	private SysEntityDto loadEntityByTableName(String packageName, String dbName, String tableName) {
		SysEntityVo vo = this.mapper.loadTableInfo(dbName, tableName);
		SysEntityDto dto = this.getInstance(this.dtoClazz).fromVo(vo);
		SysEntityGroupDto entityGroup = new SysEntityGroupDto();
		entityGroup.setName(packageName);
		entityGroup.setCode(packageName);
		dto.setEntityGroup(entityGroup);
		List<SysEntityFieldDto> fields = this.entityFieldService.loadTableColumnInfo(dbName, tableName);
		dto.setFields(fields);
		return dto;
	}

	private FileDto genCodeByDto(SysEntityDto dto) throws Exception {
		FileDto file = new FileDto();
		file.setName(dto.getName() + ".zip");

		String codePath = null;

		// 复制模板目录及文件
		codePath = CodeTemplateUtil.gen(dto, dto.getName(), true, tableName -> {
			String code = this.mapper.getGroupCode(tableName);
			return code;
		});

		// 压缩文件夹
		byte[] zipContent = zipDir(codePath);

		file.setContent(zipContent);
		return file;
	}

	private byte[] zipDir(String path) {
		String zipFilePath = path + ".zip";
		ZipUtil.createZip(path, zipFilePath);

		byte[] content = null;
		try {
			content = Files.toByteArray(new File(zipFilePath));
		} catch (IOException e) {
			e.printStackTrace();
		}
		return content;
	}

	@Override
	public FileDto genCode(List<SysEntityDto> entities) throws Exception {
		String codeFolder = "codes";

		FileDto file = new FileDto();
		file.setName(codeFolder + ".zip");

		String codePath = null;

		boolean doClearDir = true;
		for (SysEntityDto entity : entities) {
			SysEntityDto dto = this.findById(entity.getId());

			// 复制模板目录及文件
			try {
				codePath = CodeTemplateUtil.gen(dto, codeFolder, doClearDir, tableName -> {
					String code = this.mapper.getGroupCode(tableName);
					return code;
				});
				doClearDir = false;
			} catch (Exception e) {
				e.printStackTrace();
			}
		}

		// 压缩文件夹
		byte[] zipContent = zipDir(codePath);

		file.setContent(zipContent);

		return file;
	}

	@Override
	public void genEntity(String dbName) throws Exception {
		List<SysEntityVo> entities = this.mapper.loadTables(dbName);
		for (SysEntityVo entity : entities) {
			String tableName = entity.getTableName();
			String camled = CodeMeta.getCamel(tableName);
			String modulName = tableName.split("_")[0];
			List<SysEntityGroupDto> entityGroups = entityGroupService.queryByModulName(modulName);
			SysEntityDto dto = this.getInstance(dtoClazz);
			dto = dto.fromVo(entity);
			if (entityGroups != null && entityGroups.size() == 1) {
				dto.setEntityGroup(entityGroups.get(0));
			}
			dto.setCode(camled);
			List<SysEntityFieldDto> fieldDtos = entityFieldService.loadTableColumnInfo(dbName, tableName);
			dto.setFields(fieldDtos);
			this.create(dto);
		}
	}

}
