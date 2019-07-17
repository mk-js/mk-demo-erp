package com.mkdemo.erp.sys.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.alibaba.dubbo.config.annotation.Reference;
import com.alibaba.dubbo.config.annotation.Service;
import com.mk.eap.component.oid.itf.IOidService;
import com.mk.eap.entity.impl.EntityServiceImpl;
import com.mkdemo.erp.sys.dao.SysEntityFieldMapper;
import com.mkdemo.erp.sys.dto.SysEntityFieldDto;
import com.mkdemo.erp.sys.itf.ISysEntityFieldService;
import com.mkdemo.erp.sys.vo.SysEntityFieldVo;

/**
 * @Title: SysEntityFieldServiceImpl.java
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
public class SysEntityFieldServiceImpl extends
		EntityServiceImpl<SysEntityFieldDto, SysEntityFieldVo, SysEntityFieldMapper> implements ISysEntityFieldService {

	// Logger log = LoggerFactory.getLogger(SysSysWebsiteServiceImpl.class);

	@Reference
	private IOidService idService;

	@Override
	protected void setObjectKeyValue(SysEntityFieldDto createDto) {
		if (createDto.getId() == null) {
			createDto.setId(idService.generateObjectID());
		}
	}

	@Override
	public List<SysEntityFieldDto> loadTableColumnInfo(String dbName, String tableName) { 
		List<SysEntityFieldVo> fields = this.mapper.loadTableColumnInfo(dbName, tableName);
		SysEntityFieldDto dto = this.getInstance(this.dtoClazz);
		return dto.fromVo(fields);
	}
}
