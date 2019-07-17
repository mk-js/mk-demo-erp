package com.mkdemo.erp.sys.utils;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

public class ZipUtil {

	/**
	 * 创建ZIP文件
	 * 
	 * @param sourcePath
	 *            文件或文件夹路径
	 * @param zipPath
	 *            生成的zip文件存在路径（包括文件名）
	 */
	public static void createZip(String sourcePath, String zipPath) {
		FileOutputStream fos = null;
		ZipOutputStream zos = null;
		try {
			fos = new FileOutputStream(zipPath);
			zos = new ZipOutputStream(fos); 
			writeZip(new File(sourcePath), "", zos);
		} catch (FileNotFoundException e) {
			System.out.println("创建ZIP文件失败" + e.getMessage());
		} finally {
			try {
				if (zos != null) {
					zos.close();
				}
			} catch (IOException e) {
				System.out.println("创建ZIP文件失败" + e.getMessage());
			}

		}
	}

	private static void writeZip(File file, String parentPath, ZipOutputStream zos) {
		if (file.exists()) {
			if (file.isDirectory()) {// 处理文件夹
				parentPath += file.getName() + File.separator;
				File[] files = file.listFiles();
				if (files.length != 0) {
					for (File f : files) {
						writeZip(f, parentPath, zos);
					}
				} else { // 空目录则创建当前目录
					try {
						zos.putNextEntry(new ZipEntry(parentPath));
					} catch (IOException e) { 
						e.printStackTrace();
					}
				}
			} else {
				FileInputStream fis = null;
				try {
					fis = new FileInputStream(file);
					ZipEntry ze = new ZipEntry(parentPath + file.getName());
					zos.putNextEntry(ze);
					byte[] content = new byte[1024];
					int len;
					while ((len = fis.read(content)) != -1) {
						zos.write(content, 0, len);
						zos.flush();
					}

				} catch (FileNotFoundException e) {
					System.out.println("创建ZIP文件失败" + e.getMessage());
				} catch (IOException e) {
					System.out.println("创建ZIP文件失败" + e.getMessage());
				} finally {
					try {
						if (fis != null) {
							fis.close();
						}
					} catch (IOException e) {
						System.out.println("创建ZIP文件失败" + e.getMessage());
					}
				}
			}
		}
	}
}
