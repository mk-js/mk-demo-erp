package com.mkdemo.erp.sys.utils;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;

public class FileCopyUtil {
	public static void copyDir(String sourcePath, String path) throws IOException {
		File file = new File(sourcePath);
		String[] filePath = file.list();

		if (!(new File(path)).exists()) {
			(new File(path)).mkdir();
		}

		for (int i = 0; i < filePath.length; i++) {
			if ((new File(sourcePath + File.separator + filePath[i])).isDirectory()) {
				copyDir(sourcePath + File.separator + filePath[i], path + File.separator + filePath[i]);
			}

			if (new File(sourcePath + File.separator + filePath[i]).isFile()) {
				copyFile(sourcePath + File.separator + filePath[i], path + File.separator + filePath[i]);
			}

		}
	}

	@SuppressWarnings("resource")
	public static void copyFile(String oldPath, String newPath) throws IOException {
		File oldFile = new File(oldPath);
		File file = new File(newPath);
		FileInputStream in = new FileInputStream(oldFile);
		FileOutputStream out = new FileOutputStream(file); 

		byte[] buffer = new byte[2097152];
		int length = 0;

		while ((length = in.read(buffer)) != -1) {
			out.write(buffer, 0, length);
		}

	}
}
