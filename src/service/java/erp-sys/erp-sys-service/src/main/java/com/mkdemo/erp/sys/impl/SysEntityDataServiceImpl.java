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
import com.mkdemo.erp.sys.dao.SysEntityDataMapper;
import com.mkdemo.erp.sys.dto.SysEntityDataDto;
import com.mkdemo.erp.sys.itf.ISysEntityDataService;
import com.mkdemo.erp.sys.vo.SysEntityDataVo;

/**
 * @Title: SysEntityDataServiceImpl.java
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
public class SysEntityDataServiceImpl extends
		EntityServiceImpl<SysEntityDataDto, SysEntityDataVo, SysEntityDataMapper> implements ISysEntityDataService {

	// Logger log = LoggerFactory.getLogger(SysSysWebsiteServiceImpl.class);

	@Reference
	private IOidService idService;

	@Override
	protected void setObjectKeyValue(SysEntityDataDto createDto) {
		if (createDto.getId() == null) {
			createDto.setId(idService.generateObjectID());
		}
	}
 
}
