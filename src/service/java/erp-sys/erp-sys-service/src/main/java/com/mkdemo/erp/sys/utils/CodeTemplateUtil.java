package com.mkdemo.erp.sys.utils;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.function.Function;

import com.mk.eap.common.utils.JarResourceUtil;
import com.mkdemo.erp.sys.dto.SysEntityDto;
import com.mkdemo.erp.sys.dto.SysEntityFieldDto;

public class CodeTemplateUtil {
 

	public static String gen(SysEntityDto dto, String codeFolder, boolean doClearDir,
			Function<String, String> getGroupCodeByTableName) throws Exception {
		String filePath = JarResourceUtil.JarUtil.getResourseFolder();
		String templatePath = filePath + String.join(File.separator, "..", "code", "template", "entity");
		String codePath = filePath + String.join(File.separator, "code", codeFolder);

		// 复制模板目录及文件
		File temp = new File(templatePath);
		if (!temp.exists()) {
			throw new Exception("代码模板目录不存在");
		}
		File codeDir = new File(codePath);
		if (codeDir.exists() && doClearDir) {
			deleteDir(codeDir);
		}

		CodeMeta tempCode = new CodeMeta(templatePath);
		CodeMeta newCode = new CodeMeta(codePath, dto.getEntityGroup().getCode(), dto.getTableName());

		newCode.makeDirs();

		newCode.writeFiles(tempCode);

		newCode.writeFields(dto.getFields(), getGroupCodeByTableName);

		return codePath;
	}


	public static void deleteDir(File dir) {
		if (dir.isDirectory()) {
			File[] files = dir.listFiles();
			for (int i = 0; i < files.length; i++) {
				deleteDir(files[i]);
			}
		}
		dir.delete();
	}
}
