package com.mkdemo.erp.sys.utils;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.function.Function;

import com.mkdemo.erp.sys.dto.SysEntityFieldDto;
import com.mkdemo.erp.sys.utils.CodeFile;

public class CodeMeta {

	public String packageName;// com.mkdemo.erp.sys
	public String product; // eap
	public String domain; // sys
	public String module; //
	public String table; // set_department
	public String api; // /set/department

	public CodeFile dto; // SetDepartmentDto
	public CodeFile vo; // SetDepartmentVo
	public CodeFile itf; // ISetDepartmentService
	public CodeFile dao; // SetDepartmentMapper
	public CodeFile impl; // SetDepartmentServiceImpl
	public CodeFile mapper; // SetDepartmentMapper
	public String rootPath;

	public static String getCamel(String name) {
		String[] n = name.split("[_]");
		String camelName = "";
		for (int i = 0; i < n.length; i++) {
			camelName = camelName + n[i].substring(0, 1).toUpperCase() + n[i].substring(1);
		}
		return camelName;
	}

	@SuppressWarnings("resource")
	private static ArrayList<String> readAllLines(String pathname) throws IOException {
		ArrayList<String> arr = new ArrayList<>();
		File filename = new File(pathname); // 要读取以上路径的input。txt文件
		InputStreamReader reader = null;
		reader = new InputStreamReader(new FileInputStream(filename)); // 建立一个输入流对象reader
		BufferedReader br = new BufferedReader(reader); // 建立一个对象，它把文件内容转成计算机能读懂的语言
		String line = "";
		while ((line = br.readLine()) != null) {
			arr.add(line);
		}
		return arr;
	}

	public CodeMeta(String pathName) throws IOException {
		this.rootPath = pathName;
		String metaJsonFile = pathName + File.separator + "meta.json";
		loadMetaFromJson(metaJsonFile);
	}

	public CodeMeta(String pathName, String packageName, String name) {
		this.rootPath = pathName;
		expend(packageName, name);
	}

	public void makeDirs() {
		this.dto.mkdirs();
		this.itf.mkdirs();
		this.vo.mkdirs();
		this.dao.mkdirs();
		this.impl.mkdirs();
		this.mapper.mkdirs();
	}

	private void initPath() {
		String domain = this.product + "-" + this.domain;
		String module = this.product + "-" + this.domain + "-" + this.module;
		String itf = this.product + File.separator + domain;
		if (this.module != null && this.module.length() > 0) {
			itf += File.separator + module;
		} else {
			module = domain;
		}
		itf += File.separator + String.join(File.separator, module + "-interface", "src", "main", "java");
		itf += File.separator + String.join(File.separator, this.packageName.split("[.]"));
		itf = this.rootPath + File.separator + itf + File.separator;
		String impl = itf.replace("interface", "service");

		this.itf.path = itf + "itf";
		this.dto.path = itf + "dto";
		this.vo.path = itf + "vo";
		this.impl.path = impl + "impl";
		this.dao.path = impl + "dao";
		this.mapper.path = impl.substring(0, impl.indexOf("java")) + "resources" + File.separator + "mapping";
	}

	private void expend(String packageName, String name) {
		this.packageName = packageName;
		String[] p = packageName.split("[.]");
		this.product = p[2];
		this.domain = p[3];
		if (p.length > 4) {
			this.module = p[4];
		}
		String cameled = name;
		if (name.indexOf("_") != -1) {
			this.table = name;
			cameled = getCamel(name);
		} else {
			this.table = getUnderlined(name);
		}
		this.api = "/" + this.table.replace("_", "/");

		this.dto = new CodeFile(cameled + "Dto");
		this.vo = new CodeFile(cameled + "Vo");
		this.itf = new CodeFile("I" + cameled + "Service");
		this.dao = new CodeFile(cameled + "Mapper");
		this.impl = new CodeFile(cameled + "ServiceImpl");
		this.mapper = new CodeFile(cameled + "Mapper");
		this.mapper.ext = ".xml";

		initPath();
	}

	public void loadMetaFromJson(String path) throws IOException {
		ArrayList<String> lines = readAllLines(path);
		lines.forEach(l -> {
			if (l.indexOf(":") == -1) {
				return;
			}
			String[] kv = l.split(":");
			if (kv[0].indexOf("packageName") != -1) {
				this.packageName = kv[1].replace("\"", "").trim();
			}
			if (kv[0].indexOf("table") != -1) {
				this.table = kv[1].replace("\"", "").trim();
			}

		});
		if (this.packageName.indexOf(",") != -1) {
			this.packageName = this.packageName.split(",")[0];
		}
		if (this.table.indexOf(",") != -1) {
			this.table = this.table.split(",")[0];
		}

		expend(this.packageName, this.table);
	}

	private String getUnderlined(String name) {
		String underlined = "";
		boolean isFirst = true;
		for (int i = 0; i < name.length(); i++) {
			if (!isFirst && name.charAt(i) >= 'A') {
				underlined += "_";
			}
			underlined += name.substring(i, i + 1).toLowerCase();
			isFirst = false;
		}
		return underlined;
	}

	public void writeFiles(CodeMeta temp) throws IOException {
		this.dto.writeAllLines(replaceFile(temp.dto, temp));
		this.itf.writeAllLines(replaceFile(temp.itf, temp));
		this.vo.writeAllLines(replaceFile(temp.vo, temp));
		this.dao.writeAllLines(replaceFile(temp.dao, temp));
		this.impl.writeAllLines(replaceFile(temp.impl, temp));
		this.mapper.writeAllLines(replaceFile(temp.mapper, temp));
	}

	private List<String> replaceFile(CodeFile file, CodeMeta temp) throws IOException {
		List<String> tempLines = file.readAllLines();
		List<String> lines = new ArrayList<>();
		tempLines.forEach(line -> {
			String code = replaceOneLine(line, temp);
			lines.add(code);
		});

		return lines;
	}

	private String replaceOneLine(String line, CodeMeta temp) {
		String code = line;
		code = code.replace(temp.packageName, this.packageName);
		code = code.replace(temp.api, this.api);
		code = code.replace(temp.table, this.table);
		code = code.replace(temp.dto.name, this.dto.name);
		code = code.replace(temp.itf.name, this.itf.name);
		code = code.replace(temp.vo.name, this.vo.name);
		code = code.replace(temp.dao.name, this.dao.name);
		code = code.replace(temp.impl.name, this.impl.name);
		code = code.replace(temp.mapper.name, this.mapper.name);
		return code;
	}

	public void writeFields(List<SysEntityFieldDto> fields, Function<String, String> getGroupCodeByTableName)
			throws IOException {
		List<String> dtoLines = this.dto.readAllLines();
		dtoLines = replaceDtoFields(dtoLines, fields, getGroupCodeByTableName);
		this.dto.writeAllLines(dtoLines);

		List<String> voLines = this.vo.readAllLines();
		voLines = replaceVoFields(voLines, fields);
		this.vo.writeAllLines(voLines);

		List<String> implLines = this.impl.readAllLines();
		implLines = repalceImplFields(implLines, fields, getGroupCodeByTableName);
		this.impl.writeAllLines(implLines);

	}

	private List<String> replaceDtoFields(List<String> dtoLines, List<SysEntityFieldDto> fields,
			Function<String, String> getGroupCodeByTableName) {

		List<String> newLines = new ArrayList<>();
		List<String> fieldCodes = new ArrayList<>();
		HashMap<String, Boolean> importCache = new HashMap<>();
		fields.forEach(field -> {
			String name = field.getName();
			String description = field.getDescription();
			String options = field.getOptions();
			String typeName = field.getTypeName();
			if (typeName == null) {
				return;
			}
			if (name != null && !name.equals(description)) {
				description = name + "\t" + description;
			}
			if (options == null) {
				options = description;
			}
			String tableName = null;
			String dtoName = null;
			if (typeName.equals("DTO")) {
				String[] args = options.split(",");
				if (args[1].equals("id")) {
					tableName = args[0];
				} else {
					tableName = args[2];
				}
				dtoName = getCamel(tableName) + "Dto";
				typeName = dtoName;
			} else if (typeName.equals("LIST")) {
				String[] args = options.split(",");
				tableName = args[2];
				dtoName = getCamel(tableName) + "Dto";
				typeName = "List<" + dtoName + ">";
			}
			fieldCodes.add("");
			fieldCodes.add("	//" + description);
			fieldCodes.add("	private " + typeName + " " + field.getCode() + ";");
			if (tableName != null && !importCache.containsKey(dtoName)) {
				try {
					importCache.put(dtoName, true);
					importEntityReference(dtoLines, tableName, getGroupCodeByTableName, ".dto." + dtoName);
				} catch (Exception e) {
					e.printStackTrace();
				}
			}

		});

		newLines = replaceLines(dtoLines, "serialVersionUID", "}", fieldCodes);

		return newLines;
	}

	private void importEntityReference(List<String> lines, String tableName,
			Function<String, String> getGroupCodeByTableName, String... keys) throws Exception {
		String packageName = getGroupCodeByTableName.apply(tableName);
		String importCode = "";
		for (String k : keys) {
			importCode += "\r\nimport " + packageName + k + ";";
		}
		for (int i = 0; i < lines.size(); i++) {
			String line = lines.get(i);
			if (line != null && line.indexOf("package") != -1) {
				line += importCode;
				lines.set(i, line);
				break;
			}
		}
	}

	private List<String> replaceVoFields(List<String> voLines, List<SysEntityFieldDto> fields) {

		List<String> newLines = new ArrayList<>();
		List<String> fieldCodes = new ArrayList<>();
		fields.forEach(field -> {
			String typeName = field.getTypeName();

			if (typeName.equals("DTO") || typeName.equals("LIST")) {
				return;
			}
			fieldCodes.add("");
			fieldCodes.add("	//" + field.getName() + "\t" + field.getDescription());
			if (field.getCode().equals("id")) {
				fieldCodes.add("	@Id");
			}
			fieldCodes.add("	private " + field.getTypeName() + " " + field.getCode() + ";");
		});

		newLines = replaceLines(voLines, "serialVersionUID", "}", fieldCodes);

		return newLines;

	}

	private List<String> repalceImplFields(List<String> implLines, List<SysEntityFieldDto> fields,
			Function<String, String> getGroupCodeByTableName) {

		List<String> newLines = new ArrayList<>();
		List<String> fieldCodes = new ArrayList<>();
		HashMap<String, String> injectors = new HashMap<>();
		HashMap<String, Boolean> importCache = new HashMap<>();
		fields.forEach(field -> {
			String typeName = field.getTypeName();
			String options = field.getOptions();
			if (options == null) {
				options = field.getDescription();
			}
			if (typeName == null) {
				return;
			}
			String tableName = null;
			String entityName = null;
			String injectorCode = null;
			if (typeName.equals("DTO")) {
				// sys_entity.entityGroup:
				// sys_entity_group,id,sys_entity,entityGroupId
				// sys_entity,entityGroupId,sys_entity_group,id
				String[] args = options.split(",");
				if (args[1].equals("id")) {
					tableName = args[0];
				} else {
					tableName = args[2];
				}
				injectorCode = replaceRefInjectorCode(field);
			} else if (typeName.equals("LIST")) {
				// sys_entity.fields:
				// sys_entity,id,sys_entity_field,entityId
				tableName = options.split(",")[2];
				injectorCode = replaceComposInjectorCode(field);
			} else {
				return;
			}
			try {
				injectors.put(field.getCode(), injectorCode);
				entityName = getCamel(tableName);
				String dtoName = entityName + "Dto";
				String itfName = "I" + entityName + "Service";
				String serviceName = entityName.substring(0, 1).toLowerCase() + entityName.substring(1) + "Service";
				if (!importCache.containsKey(entityName)) {
					importCache.put(entityName, true);
					importEntityReference(implLines, tableName, getGroupCodeByTableName, ".dto." + dtoName,
							".itf." + itfName);
					fieldCodes.add("");
					fieldCodes.add("	@Reference");
					fieldCodes.add("	private " + itfName + " " + serviceName + ";");
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		});
		fieldCodes.add("");
		fieldCodes.add("	public " + this.impl.name + "() {");
		fieldCodes.add("		super();");
		injectors.keySet().forEach(key -> {
			fieldCodes.add("		this.getInjectors().add(" + key + "Injector());");
		});
		fieldCodes.add("	}");
		fieldCodes.add("");
		injectors.keySet().forEach(key -> {
			fieldCodes.add(injectors.get(key));
		});

		newLines = replaceLines(implLines, "private IOidService idService;", "@Override", fieldCodes);

		return newLines;
	}

	private static String TemplateCompositionInjector = "	private EntityCompositionInjector<SysEntityDto, SysEntityFieldDto> fieldsInjector() {\r\n"
			+ "		return new EntityCompositionInjector<>(\"fields\", \"entityId\", SysEntityFieldDto.class, "
			+ "() -> sysEntityFieldService);\r\n" + "	}\r\n";

	private String replaceComposInjectorCode(SysEntityFieldDto field) {
		// sys_entity.fields:
		// sys_entity,id,sys_entity_field,entityId
		String options = field.getOptions();
		if (options == null) {
			options = field.getDescription();
		}
		String[] args = options.split(",");
		String entityDto = getCamel(args[0]) + "Dto";
		String fieldCode = field.getCode();
		String refEntityDto = getCamel(args[2]) + "Dto";
		String refEntityService = getCamel(args[2]) + "Service";
		String refField = args[3];

		refEntityService = refEntityService.substring(0, 1).toLowerCase() + refEntityService.substring(1);

		String code = TemplateCompositionInjector.replace("SysEntityFieldDto", refEntityDto)
				.replace("sysEntityFieldService", refEntityService).replace("entityId", refField)
				.replace("SysEntityDto", entityDto).replace("fields", fieldCode);
		return code;
	}

	private static String TemplateReferenceInjector = "	private EntityReflectionInjector<SysEntityDto, SysEntityGroupDto> entityGroupInjector() {\r\n"
			+ "		return new EntityReflectionInjector<>(\"entityGroup\", \"entityGroupId\", SysEntityGroupDto.class,"
			+ "() -> sysEntityGroupService);\r\n" + "	}\r\n";

	private String replaceRefInjectorCode(SysEntityFieldDto field) {
		// sys_entity.entityGroup:
		// sys_entity_group,id,sys_entity,entityGroupId
		// sys_entity,entityGroupId,sys_entity_group,id
		String options = field.getOptions();
		if (options == null) {
			options = field.getDescription();
		}
		String[] args = options.split(",");
		String entityDto = getCamel(args[2]) + "Dto";
		String refEntityDto = getCamel(args[0]) + "Dto";
		String refEntityService = getCamel(args[0]) + "Service";
		String refField = args[3];
		String fieldCode = field.getCode();
		if (args[1].equals("id")) {
			entityDto = getCamel(args[2]) + "Dto";
			refEntityDto = getCamel(args[0]) + "Dto";
			refEntityService = getCamel(args[0]) + "Service";
			refField = args[3];
		} else {
			entityDto = getCamel(args[0]) + "Dto";
			refEntityDto = getCamel(args[2]) + "Dto";
			refEntityService = getCamel(args[2]) + "Service";
			refField = args[1];
		}

		refEntityService = refEntityService.substring(0, 1).toLowerCase() + refEntityService.substring(1);

		String code = TemplateReferenceInjector.replace("SysEntityGroupDto", refEntityDto)
				.replace("sysEntityGroupService", refEntityService).replace("entityGroupId", refField)
				.replace("SysEntityDto", entityDto).replace("entityGroup", fieldCode);
		return code;
	}

	private List<String> replaceLines(List<String> lines, String startKey, String endKey, List<String> insertLines) {

		boolean beginSkip = false;
		List<String> newLines = new ArrayList<>();
		for (String l : lines) {
			if (l.indexOf(startKey) != -1) {
				beginSkip = true;
				newLines.add(l);
			} else if (beginSkip && l.indexOf(endKey) != -1) {
				beginSkip = false;
				insertLines.forEach(c -> newLines.add(c));
			}
			if (beginSkip) {
				continue;
			}
			newLines.add(l);
		}
		return newLines;
	}
}
