package com.mkdemo.erp.sys.dto;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.mk.eap.common.domain.DTO;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString; 

@Getter @Setter @ToString
public class SysEntityGroupDto extends DTO implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

    private Long id;

    //所属包
    private Long parentId;

    //编码
    private String code;
    
    //名称
    private String name;

    //描述
    private String description;  

    //停用
    private Integer isNoUsed;

    //创建时间
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date createTime;

    //更新时间
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date updateTime;
    
    //时间戳
    private Timestamp ts; 
    
    //上级对象
    private SysEntityGroupDto parent;
    
    //下级对象
    private List<SysEntityGroupDto> children;
}
