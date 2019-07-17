package com.mkdemo.erp.sys.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.mk.eap.entity.dao.EntityMapper;
import com.mkdemo.erp.sys.vo.SysEntityFieldVo;

/**
 * @Title: SysEntityFieldMapper.java
 * @Package: com.mkdemo.erp.sys.dao
 * @Description: 类文件概述
 * 
 *               <p>
 *               类文件详细描述
 *               </p>
 * 
 * @author lsg
 * 
 */
public interface SysEntityFieldMapper extends EntityMapper<SysEntityFieldVo> {

	// 读取表信息
	List<SysEntityFieldVo> loadTableColumnInfo(@Param("dbName") String dbName, @Param("tableName") String tableName);
}
