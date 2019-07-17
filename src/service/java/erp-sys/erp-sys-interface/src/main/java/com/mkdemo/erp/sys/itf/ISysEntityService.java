package com.mkdemo.erp.sys.itf;

import java.util.List;

import org.springframework.web.bind.annotation.RequestMapping;

import com.mk.eap.common.annotation.ApiMapping;
import com.mk.eap.common.domain.FileDto;
import com.mk.eap.entity.itf.IEntityService;
import com.mk.eap.entity.itf.IPageService;
import com.mkdemo.erp.sys.dto.SysEntityDto;

@RequestMapping("/sys/entity")
@ApiMapping("create;query;update;delete;prev;next;queryPageList;genEntity;genCode") // create;query;update;delete
public interface ISysEntityService extends IEntityService<SysEntityDto>,IPageService<SysEntityDto> {

	// 通过数据库表名生成实体对象
	SysEntityDto createByTableName(String packageName, String dbName, String tableName);

	// 通过数据库表名生成服务代码
	FileDto genCodeByTableName(String packageName, String dbName, String tableName) throws Exception;

	// 通过实体生成服务代码
	FileDto genCode(List<SysEntityDto> entities) throws Exception;
	
	// 通过数据库表名生成实体信息（表、字段）
	void genEntity(String dbName) throws Exception;
}
