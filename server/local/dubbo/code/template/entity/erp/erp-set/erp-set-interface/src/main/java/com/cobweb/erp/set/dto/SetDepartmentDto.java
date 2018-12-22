package com.cobweb.erp.set.dto;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Date;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.mk.eap.common.domain.DTO;
import com.mk.eap.common.annotation.ApiContext;
import com.mk.eap.common.domain.Token;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class SetDepartmentDto extends DTO implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private Long id;

	// 上级部门
	private Long departmentId;

	// 部门编号
	private String code;

	// 部门名称
	private String name; 
	
	// 描述
	private String description;

	// 停用
	private Integer isNoUsed;

	// 创建时间
	@JsonFormat(pattern = "yyyy-MM-dd")
	private Date createTime;

	// 更新时间
	@JsonFormat(pattern = "yyyy-MM-dd")
	private Date updateTime;

	// 时间戳
	private Timestamp ts;

	// 上级部门
	private SetDepartmentDto department;
	
	// 下级部门
	List<SetDepartmentDto> children;
}
