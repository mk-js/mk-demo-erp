package com.cobweb.erp.set.vo;

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
@Table(name="set_department")
public class SetDepartmentVo extends VO implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	/**
     * ID
     */
	@Id
    private Long id;

	// 上级部门
	private Long departmentId;

	// 部门编号
	private String code;

    //网站名称
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
}
