package com.mkdemo.erp.sys.itf;

import java.util.List;

import org.springframework.web.bind.annotation.RequestMapping;

import com.mk.eap.common.annotation.ApiMapping;
import com.mk.eap.entity.itf.IEntityService;
import com.mk.eap.entity.itf.IPageService;
import com.mk.mkdemo.erp.dto.SysEntityGroupDto;  

@RequestMapping("/sys/entity/group")
@ApiMapping("create;query;update;delete;queryPageList")//create;query;update;delete
public interface ISysEntityGroupService extends IEntityService<SysEntityGroupDto>,IPageService<SysEntityGroupDto> {

	List<SysEntityGroupDto> queryTree();

	List<SysEntityGroupDto> queryByModulName(String modulName);
	
 
}
