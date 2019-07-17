package com.mkdemo.erp.sys.impl;

import java.util.List;

import org.springframework.stereotype.Component;

import com.alibaba.dubbo.config.annotation.Reference;
import com.alibaba.dubbo.config.annotation.Service;
import com.mk.eap.common.utils.DtoTreeUtil;
import com.mk.eap.component.oid.itf.IOidService;
import com.mk.eap.entity.impl.EntityReflectionInjector;
import com.mk.eap.entity.impl.EntityServiceImpl;
import com.mkdemo.erp.sys.dao.SysEntityGroupMapper;
import com.mkdemo.erp.sys.dto.SysEntityGroupDto;
import com.mkdemo.erp.sys.itf.ISysEntityGroupService;
import com.mkdemo.erp.sys.vo.SysEntityGroupVo;

import tk.mybatis.mapper.entity.Example;

/**
 * @Title: SysEntityGroupServiceImpl.java
 * @Package: com.mkdemo.erp.sys.impl
 * @Description: 实体字段接口实现类
 * @version 1.0
 * 
 *          <p>
 *          实体字段接口实现类
 *          </p>
 * 
 * @author lsg
 * 
 */
@Component
@Service
public class SysEntityGroupServiceImpl extends
		EntityServiceImpl<SysEntityGroupDto, SysEntityGroupVo, SysEntityGroupMapper> implements ISysEntityGroupService {

	// Logger log = LoggerFactory.getLogger(SysSysWebsiteServiceImpl.class);

	@Reference
	private IOidService idService;

	@Override
	protected void setObjectKeyValue(SysEntityGroupDto createDto) {
		if (createDto.getId() == null) {
			createDto.setId(idService.generateObjectID());
		}
	}

	public SysEntityGroupServiceImpl() {
		super();
		this.getInjectors().add(parentInjector());
	}

	private EntityReflectionInjector<SysEntityGroupDto, SysEntityGroupDto> parentInjector() {
		return new EntityReflectionInjector<>("parent", "parentId", SysEntityGroupDto.class, () -> this);
	}

	@Override
	public List<SysEntityGroupDto> queryTree() {
		List<SysEntityGroupDto> dtos = query(new SysEntityGroupDto());
		List<SysEntityGroupDto> tree = DtoTreeUtil.Builder(dtos, "id", "parentId", "children", null);
		return tree;
	}

	@Override
	public List<SysEntityGroupDto> queryByModulName(String modulName) {
		Example example = new Example(voClazz);
		example.createCriteria().andLike("code", "%." + modulName);
		SysEntityGroupDto dto = this.getInstance(dtoClazz);
		List<SysEntityGroupVo> vos = this.mapper.selectByExample(example);
		return dto.fromVo(vos);
	}
}
