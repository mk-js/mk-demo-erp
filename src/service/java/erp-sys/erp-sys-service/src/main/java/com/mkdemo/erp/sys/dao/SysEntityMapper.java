package com.mkdemo.erp.sys.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.mk.eap.entity.dao.EntityMapper;
import com.mkdemo.erp.sys.vo.SysEntityVo;

/**
 * @Title: SysEntityMapper.java
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
public interface SysEntityMapper extends EntityMapper<SysEntityVo> {
	// 读取表信息
	SysEntityVo loadTableInfo(@Param("dbName") String dbName, @Param("tableName") String tableName);

	// 自动生成实体信息
	List<SysEntityVo> loadTables(@Param("dbName") String dbName);

	// 通过表名取对应的包名
	String getGroupCode(@Param("tableName") String tableName);
}
