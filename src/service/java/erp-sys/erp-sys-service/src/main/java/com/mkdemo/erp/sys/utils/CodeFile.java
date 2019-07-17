package com.mkdemo.erp.sys.utils;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

public class CodeFile {

	public CodeFile(String name) {
		this.name = name;
	}

	public String name;
	public String ext = ".java";
	public String path;
	public List<String> lines;

	public void mkdirs() {
		new File(path).mkdirs();
	}

	List<String> readAllLines() throws IOException {
		Path filePath = Paths.get(path + File.separator + name + ext);
		lines = Files.readAllLines(filePath, StandardCharsets.UTF_8);
		return lines;
	}

	void writeAllLines(List<String> lines) throws IOException {
		Path filePath = Paths.get(path + File.separator + name + ext);
		Files.write(filePath, lines, StandardCharsets.UTF_8);
	}
}
