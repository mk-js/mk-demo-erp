package com.mkdemo.erp.sys.itf;

import java.util.List;

import org.springframework.web.bind.annotation.RequestMapping;

import com.mk.eap.common.annotation.ApiMapping;
import com.mk.eap.entity.itf.IEntityService;
import com.mkdemo.erp.sys.dto.SysEntityDataDto;

@RequestMapping("/sys/entity/data")
@ApiMapping("*")//create;query;update;delete
public interface ISysEntityDataService extends IEntityService<SysEntityDataDto> {
 
}
