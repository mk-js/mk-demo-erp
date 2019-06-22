package com.mkdemo.erp.sys.vo;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Date;

import javax.persistence.Table;

import javax.persistence.Id;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.mk.eap.common.domain.VO;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @ToString
@Table(name="sys_entity_data")
public class SysEntityDataVo extends VO implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	/**
     * ID
     */
	@Id
    private Long id;
	
	//所属实体ID
    private Long entityId;

    //编码
    private String code;
    
    //名称
    private String name;

    //描述
    private String description; 
    
    //扩展字段
    private String extra;

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
}
