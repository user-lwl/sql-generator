// 定义不同数据库的字段类型
const dbFieldTypes = {
    mysql: [
        { value: 'varchar', label: 'VARCHAR' },
        { value: 'int', label: 'INT' },
        { value: 'bigint', label: 'BIGINT' },
        { value: 'datetime', label: 'DATETIME' },
        { value: 'text', label: 'TEXT' },
        { value: 'decimal', label: 'DECIMAL' },
        { value: 'tinyint', label: 'TINYINT' }
    ],
    oracle: [
        { value: 'varchar2', label: 'VARCHAR2' },
        { value: 'number', label: 'NUMBER' },
        { value: 'clob', label: 'CLOB' },
        { value: 'timestamp', label: 'TIMESTAMP' },
        { value: 'date', label: 'DATE' },
        { value: 'char', label: 'CHAR' },
        { value: 'raw', label: 'RAW' }
    ]
};

// 初始化应用
document.addEventListener('DOMContentLoaded', function() {
    // 初始化字段管理
    initFieldManagement();
    
    // 初始化SQL生成
    initSqlGenerator();
    
    // 初始化复制功能
    initCopyButtons();
    
    // 添加默认的第一个字段（通常是id主键）
    addDefaultIdField();
    
    // 初始化数据库类型切换事件
    initDbTypeChange();
});

// 初始化数据库类型切换事件
function initDbTypeChange() {
    const dbTypeSelect = document.getElementById('db-type');
    dbTypeSelect.addEventListener('change', function() {
        updateAllFieldTypes(this.value);
    });
}

// 更新所有字段的字段类型下拉框
function updateAllFieldTypes(dbType) {
    const fieldTypeSelects = document.querySelectorAll('.field-type');
    fieldTypeSelects.forEach(select => {
        updateFieldTypeOptions(select, dbType);
    });
}

// 更新字段类型下拉框选项
function updateFieldTypeOptions(select, dbType) {
    // 保存当前选中的值
    const currentValue = select.value;
    
    // 清空下拉框
    select.innerHTML = '';
    
    // 添加新选项
    dbFieldTypes[dbType].forEach(type => {
        const option = document.createElement('option');
        option.value = type.value;
        option.textContent = type.label;
        select.appendChild(option);
    });
    
    // 尝试恢复选中的值，如果不存在则选择第一个
    if (dbFieldTypes[dbType].some(type => type.value === currentValue)) {
        select.value = currentValue;
    } else {
        select.selectedIndex = 0;
    }
}

// 添加默认的ID字段
function addDefaultIdField() {
    const fieldsContainer = document.getElementById('fields-container');
    
    // 清空字段容器
    fieldsContainer.innerHTML = '';
    
    // 创建默认的ID字段
    const fieldItem = createFieldItem();
    fieldsContainer.appendChild(fieldItem);
    
    // 设置默认值
    const inputs = fieldItem.querySelectorAll('input, select');
    inputs.forEach(input => {
        if (input.classList.contains('field-name')) {
            input.value = 'id';
        } else if (input.classList.contains('field-comment')) {
            input.value = '主键ID';
        } else if (input.classList.contains('field-type')) {
            // 根据数据库类型设置默认ID字段类型
            const dbType = document.getElementById('db-type').value;
            if (dbType === 'mysql') {
                input.value = 'bigint';
            } else if (dbType === 'oracle') {
                input.value = 'number';
            }
        } else if (input.classList.contains('field-length')) {
            input.value = '20';
        } else if (input.classList.contains('field-primary')) {
            input.checked = true;
        } else if (input.classList.contains('field-not-null')) {
            input.checked = true;
        } else if (input.classList.contains('field-auto-increment')) {
            input.checked = true;
        } else if (input.classList.contains('fixed-value')) {
            input.value = '';
        }
    });

    // 确保固定值容器初始状态正确
    const fixedValueContainer = fieldItem.querySelector('.fixed-value-container');
    fixedValueContainer.style.display = 'none';
    const dataTypeSelect = fieldItem.querySelector('.data-type');
    dataTypeSelect.value = 'none';
}

// 初始化字段管理
function initFieldManagement() {
    // 获取添加字段按钮
    const addFieldBtn = document.getElementById('add-field-btn');
    
    // 为添加字段按钮添加点击事件
    addFieldBtn.addEventListener('click', function() {
        // 创建新字段
        const fieldItem = createFieldItem();
        
        // 添加到字段容器
        document.getElementById('fields-container').appendChild(fieldItem);

        // 为数据类型选择框添加事件监听
        const dataTypeSelect = fieldItem.querySelector('.data-type');
        const fixedValueContainer = fieldItem.querySelector('.fixed-value-container');
        
        dataTypeSelect.addEventListener('change', function() {
            if (this.value === 'fixed') {
                fixedValueContainer.style.display = 'block';
            } else {
                fixedValueContainer.style.display = 'none';
            }
        });
        
        // 初始化显示状态
        if (dataTypeSelect.value === 'fixed') {
            fixedValueContainer.style.display = 'block';
        }
    });
}

// 创建字段项
function createFieldItem() {
    // 创建字段项元素
    const fieldItem = document.createElement('div');
    fieldItem.className = 'field-item card mb-3';
    
    // 获取当前数据库类型
    const dbType = document.getElementById('db-type').value;
    
    // 生成字段类型选项HTML
    let fieldTypeOptionsHtml = '';
    dbFieldTypes[dbType].forEach(type => {
        fieldTypeOptionsHtml += `<option value="${type.value}">${type.label}</option>`;
    });
    
    // 设置字段项内容
    fieldItem.innerHTML = `
        <div class="card-body">
            <div class="row mb-2">
                <div class="col-md-6">
                    <label class="form-label">字段名</label>
                    <input type="text" class="form-control field-name" placeholder="字段名（英文）">
                </div>
                <div class="col-md-6">
                    <label class="form-label">字段注释</label>
                    <input type="text" class="form-control field-comment" placeholder="字段注释（中文）">
                </div>
            </div>
            <div class="row mb-2">
                <div class="col-md-6">
                    <label class="form-label">字段类型</label>
                    <select class="form-select field-type">
                        ${fieldTypeOptionsHtml}
                    </select>
                </div>
                <div class="col-md-6">
                    <label class="form-label">数据类型</label>
                    <select class="form-select data-type">
                        <option value="none">无特定类型</option>
                        <option value="name">姓名</option>
                        <option value="address">地址</option>
                        <option value="email">电子邮箱</option>
                        <option value="id_card">身份证号</option>
                        <option value="phone">手机号</option>
                        <option value="date">日期</option>
                        <option value="fixed">固定数据</option>
                    </select>
                </div>
                <div class="col-md-6">
                    <label class="form-label">长度/值</label>
                    <input type="text" class="form-control field-length" placeholder="字段长度">
                </div>
                <div class="col-md-6 fixed-value-container" style="display: none;">
                    <label class="form-label">固定值</label>
                    <input type="text" class="form-control fixed-value" placeholder="请输入固定值">
                </div>
            </div>
            <div class="row mb-2">
                <div class="col-md-6">
                    <div class="form-check">
                        <input class="form-check-input field-primary" type="checkbox">
                        <label class="form-check-label">主键</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input field-not-null" type="checkbox">
                        <label class="form-check-label">非空</label>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-check">
                        <input class="form-check-input field-auto-increment" type="checkbox">
                        <label class="form-check-label">自增</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input field-unique" type="checkbox">
                        <label class="form-check-label">唯一</label>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <label class="form-label">默认值</label>
                    <input type="text" class="form-control field-default" placeholder="默认值">
                </div>
                <div class="col-md-6 d-flex align-items-end">
                    <button type="button" class="btn btn-danger remove-field-btn">
                        <i class="bi bi-trash"></i> 删除字段
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // 为删除字段按钮添加点击事件
    const removeFieldBtn = fieldItem.querySelector('.remove-field-btn');
    removeFieldBtn.addEventListener('click', function() {
        // 获取字段容器
        const fieldsContainer = document.getElementById('fields-container');
        
        // 如果只有一个字段，不允许删除
        if (fieldsContainer.children.length <= 1) {
            alert('至少需要保留一个字段');
            return;
        }
        
        // 删除字段项
        fieldItem.remove();
    });

    // 为初始字段的数据类型选择框添加事件监听
    const dataTypeSelect = fieldItem.querySelector('.data-type');
    const fixedValueContainer = fieldItem.querySelector('.fixed-value-container');
    
    dataTypeSelect.addEventListener('change', function() {
        if (this.value === 'fixed') {
            fixedValueContainer.style.display = 'block';
        } else {
            fixedValueContainer.style.display = 'none';
        }
    });
    
    return fieldItem;
}

// 初始化SQL生成
function initSqlGenerator() {
    // 获取生成SQL按钮
    const generateSqlBtn = document.getElementById('generate-sql-btn');
    
    // 为生成SQL按钮添加点击事件
    generateSqlBtn.addEventListener('click', function() {
        // 生成建表SQL
        generateCreateTableSql();
        
        // 生成插入SQL
        generateInsertSql();
    });
}

// 生成建表SQL
function generateCreateTableSql() {
    // 获取数据库名、表名和表注释
    const databaseName = document.getElementById('database-name').value.trim();
    const tableName = document.getElementById('table-name').value.trim();
    const tableComment = document.getElementById('table-comment').value.trim();
    const dbType = document.getElementById('db-type').value;
    
    // 表名验证由generateInsertSql统一处理
    if (!tableName) return;
    
    // 获取字段列表
    const fieldItems = document.querySelectorAll('.field-item');
    const fields = [];
    
    // 遍历字段项
    fieldItems.forEach(item => {
        // 获取字段信息
        const name = item.querySelector('.field-name').value.trim();
        const comment = item.querySelector('.field-comment').value.trim();
        const type = item.querySelector('.field-type').value;
        const length = item.querySelector('.field-length').value.trim();
        const isPrimary = item.querySelector('.field-primary').checked;
        const isNotNull = item.querySelector('.field-not-null').checked;
        const isAutoIncrement = item.querySelector('.field-auto-increment').checked;
        const isUnique = item.querySelector('.field-unique').checked;
        const defaultValue = item.querySelector('.field-default').value.trim();
        const dataType = item.querySelector('.data-type').value;
        const fixedValue = dataType === 'fixed' ? item.querySelector('.fixed-value').value.trim() : '';
        
        // 验证字段名
        if (!name) {
            alert('字段名不能为空');
            return;
        }
        
        // 添加字段
        fields.push({
            name,
            comment,
            type,
            length,
            isPrimary,
            isNotNull,
            isAutoIncrement,
            isUnique,
            defaultValue,
            dataType,
            fixedValue
        });
    });
    
    // 根据数据库类型生成SQL
    if (dbType === 'mysql') {
        generateMySqlCreateTable(databaseName, tableName, tableComment, fields);
    } else if (dbType === 'oracle') {
        generateOracleCreateTable(databaseName, tableName, tableComment, fields);
    }
}

// 生成MySQL建表SQL
function generateMySqlCreateTable(databaseName, tableName, tableComment, fields) {
    // 生成SQL
    let sql = '';
    
    // 添加数据库名
    if (databaseName) {
        sql += `USE \`${databaseName}\`;\n\n`;
    }
    
    // 添加删除表语句
    sql += `DROP TABLE IF EXISTS \`${tableName}\`;\n\n`;
    
    // 添加建表语句
    sql += `CREATE TABLE \`${tableName}\` (\n`;
    
    // 添加字段
    const fieldSqls = [];
    let primaryKeys = [];
    
    // 遍历字段
    fields.forEach(field => {
        let fieldSql = `  \`${field.name}\` ${field.type.toUpperCase()}`;
        
        // 添加长度
        if (field.length) {
            fieldSql += `(${field.length})`;
        }
        
        // 添加非空约束
        if (field.isNotNull) {
            fieldSql += ' NOT NULL';
        }
        
        // 添加自增约束
        if (field.isAutoIncrement) {
            fieldSql += ' AUTO_INCREMENT';
        }
        
        // 添加默认值
        if (field.defaultValue) {
            fieldSql += ` DEFAULT ${field.defaultValue}`;
        }
        
        // 添加唯一约束
        if (field.isUnique && !field.isPrimary) {
            fieldSql += ' UNIQUE';
        }
        
        // 添加注释
        if (field.comment) {
            fieldSql += ` COMMENT '${field.comment}'`;
        }
        
        // 添加到字段SQL列表
        fieldSqls.push(fieldSql);
        
        // 如果是主键，添加到主键列表
        if (field.isPrimary) {
            primaryKeys.push(field.name);
        }
    });
    
    // 添加主键约束
    if (primaryKeys.length > 0) {
        fieldSqls.push(`  PRIMARY KEY (\`${primaryKeys.join('`, `')}\`)`);
    }
    
    // 拼接字段SQL
    sql += fieldSqls.join(',\n');
    
    // 添加表注释
    sql += `\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`;
    
    if (tableComment) {
        sql += ` COMMENT='${tableComment}'`;
    }
    
    sql += ';';
    
    // 显示SQL
    document.getElementById('create-sql-output').textContent = sql;
}

// 生成Oracle建表SQL
function generateOracleCreateTable(databaseName, tableName, tableComment, fields) {
    // 生成SQL
    let sql = '';
    
    // 添加删除表语句
    sql += `DROP TABLE "${tableName}" CASCADE CONSTRAINTS;\n\n`;
    
    // 添加建表语句
    sql += `CREATE TABLE "${tableName}" (\n`;
    
    // 添加字段
    const fieldSqls = [];
    let primaryKeys = [];
    let sequenceSql = '';
    let commentSql = '';
    
    // 遍历字段
    fields.forEach(field => {
        // Oracle中的数据类型映射
        let oracleType = field.type.toUpperCase();
        switch (oracleType) {
            case 'VARCHAR':
                oracleType = 'VARCHAR2';
                break;
            case 'TEXT':
                oracleType = 'CLOB';
                break;
            case 'DATETIME':
                oracleType = 'TIMESTAMP';
                break;
            case 'TINYINT':
                oracleType = 'NUMBER(1)';
                break;
        }
        
        let fieldSql = `  "${field.name}" ${oracleType}`;
        
        // 添加长度
        if (field.length && !oracleType.includes('NUMBER') && !oracleType.includes('CLOB')) {
            fieldSql += `(${field.length})`;
        }
        
        // 添加非空约束
        if (field.isNotNull) {
            fieldSql += ' NOT NULL';
        }
        
        // 添加默认值
        if (field.defaultValue) {
            fieldSql += ` DEFAULT ${field.defaultValue}`;
        }
        
        // 添加到字段SQL列表
        fieldSqls.push(fieldSql);
        
        // 如果是主键，添加到主键列表
        if (field.isPrimary) {
            primaryKeys.push(field.name);
        }
        
        // 添加注释
        if (field.comment) {
            commentSql += `COMMENT ON COLUMN "${tableName}"."${field.name}" IS '${field.comment}';\n`;
        }
        
        // 如果是自增字段，创建序列和触发器
        if (field.isAutoIncrement) {
            sequenceSql += `\n-- 创建序列\nCREATE SEQUENCE "${tableName}_SEQ" START WITH 1 INCREMENT BY 1;\n\n`;
            sequenceSql += `-- 创建触发器\nCREATE OR REPLACE TRIGGER "${tableName}_TRG"\nBEFORE INSERT ON "${tableName}"\nFOR EACH ROW\nBEGIN\n  SELECT "${tableName}_SEQ".NEXTVAL INTO :NEW."${field.name}" FROM DUAL;\nEND;\n/\n`;
        }
    });
    
    // 添加主键约束
    if (primaryKeys.length > 0) {
        fieldSqls.push(`  CONSTRAINT "PK_${tableName}" PRIMARY KEY ("${primaryKeys.join('", "')}")`);
    }
    
    // 拼接字段SQL
    sql += fieldSqls.join(',\n');
    
    sql += '\n);\n';
    
    // 添加表注释
    if (tableComment) {
        sql += `\nCOMMENT ON TABLE "${tableName}" IS '${tableComment}';\n`;
    }
    
    // 添加字段注释
    if (commentSql) {
        sql += '\n' + commentSql;
    }
    
    // 添加序列和触发器
    if (sequenceSql) {
        sql += sequenceSql;
    }
    
    // 显示SQL
    document.getElementById('create-sql-output').textContent = sql;
}

// 生成插入SQL
function generateInsertSql() {
    // 获取表名和数据库类型
    const tableName = document.getElementById('table-name').value.trim();
    const dbType = document.getElementById('db-type').value;
    
    // 验证表单
    if (!tableName) {
        alert('表名不能为空');
        return;
    }
    
    // 获取字段列表
    const fieldItems = document.querySelectorAll('.field-item');
    const fields = [];
    
    // 遍历字段项
    fieldItems.forEach(item => {
        // 获取字段信息
        const name = item.querySelector('.field-name').value.trim();
        const type = item.querySelector('.field-type').value;
        const dataType = item.querySelector('.data-type').value;
        const isAutoIncrement = item.querySelector('.field-auto-increment').checked;
        const fixedValue = dataType === 'fixed' ? item.querySelector('.fixed-value').value.trim() : '';
        
        // 验证字段名
        if (!name) {
            alert('字段名不能为空');
            return;
        }
        
        // 添加字段
        fields.push({
            name,
            type,
            dataType,
            isAutoIncrement,
            fixedValue
        });
    });
    
    // 获取数据条数
    const dataCount = parseInt(document.getElementById('data-count').value) || 10;
    
    // 根据数据库类型生成SQL
    if (dbType === 'mysql') {
        generateMySqlInsertSql(tableName, fields, dataCount);
    } else if (dbType === 'oracle') {
        generateOracleInsertSql(tableName, fields, dataCount);
    }
}

// 生成MySQL插入SQL
function generateMySqlInsertSql(tableName, fields, dataCount) {
    // 生成SQL
    let sql = '';
    
    // 添加插入语句
    sql += `INSERT INTO \`${tableName}\` (`;
    
    // 添加字段名
    const fieldNames = fields.map(field => `\`${field.name}\``);
    sql += fieldNames.join(', ');
    
    sql += ') VALUES\n';
    
    // 添加数据
    const rows = [];
    
    // 生成多行数据
    for (let i = 0; i < dataCount; i++) {
        const values = fields.map(field => {
            // 如果是自增字段，使用NULL
            if (field.isAutoIncrement) {
                return 'NULL';
            }
            
            // 优先使用默认值
            if (field.defaultValue && field.defaultValue.trim() !== '') {
                return `'${field.defaultValue.trim()}'`;
            }
            
            // 根据数据类型从sampleData中随机取值或使用固定值
            switch (field.dataType) {
                case 'name':
                    return `'${sampleData.names[Math.floor(Math.random() * sampleData.names.length)]}'`;
                case 'address':
                    return `'${sampleData.addresses[Math.floor(Math.random() * sampleData.addresses.length)]}'`;
                case 'email':
                    return `'${sampleData.emails[Math.floor(Math.random() * sampleData.emails.length)]}'`;
                case 'id_card':
                    return `'${sampleData.idCards[Math.floor(Math.random() * sampleData.idCards.length)]}'`;
                case 'phone':
                    return `'${sampleData.phones[Math.floor(Math.random() * sampleData.phones.length)]}'`;
                case 'date':
                    return `'${sampleData.dates[Math.floor(Math.random() * sampleData.dates.length)]}'`;
                case 'fixed':
                    if (field.fixedValue && field.fixedValue.trim() !== '') {
                        return `'${field.fixedValue.trim()}'`;
                    }
                    return `'${field.name}'`;
                default:
                    // 生成更真实的随机数据
                    switch (field.type.toLowerCase()) {
                        case 'varchar':
                            // 生成随机字符串
                            const randomStr = Math.random().toString(36).substring(2, 8);
                            return `'${field.name}_${randomStr}'`;
                        case 'int':
                        case 'bigint':
                            // 生成随机整数
                            return Math.floor(Math.random() * 1000) + 1;
                        case 'datetime':
                            // 生成随机日期时间
                            const year = 2020 + Math.floor(Math.random() * 5);
                            const month = Math.floor(Math.random() * 12) + 1;
                            const day = Math.floor(Math.random() * 28) + 1;
                            return `'${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${Math.floor(Math.random() * 24).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}'`;
                        case 'text':
                            // 生成随机文本
                            const randomText = Math.random().toString(36).substring(2, 10);
                            return `'这是${field.name}字段的随机数据: ${randomText}'`;
                        case 'decimal':
                            // 生成随机小数
                            return (Math.random() * 1000).toFixed(2);
                        case 'tinyint':
                            return Math.round(Math.random());
                        default:
                            return 'NULL';
                    }
            }
        });
        
        rows.push(`(${values.join(', ')})`);
    }
    
    sql += rows.join(',\n');
    
    sql += ';';
    
    // 显示SQL
    document.getElementById('insert-sql-output').textContent = sql;
}

// 生成Oracle插入SQL
function generateOracleInsertSql(tableName, fields, dataCount) {
    // 生成SQL
    let sql = '';
    
    // Oracle通常使用多个INSERT语句而不是一个多值INSERT
    for (let i = 0; i < dataCount; i++) {
        sql += `INSERT INTO "${tableName}" (`;
        
        // 添加字段名
        const fieldNames = fields.map(field => `"${field.name}"`);
        sql += fieldNames.join(', ');
        
        sql += ') VALUES (';
        
        // 添加值
        const values = fields.map(field => {
            // 如果是自增字段，使用序列
            if (field.isAutoIncrement) {
                return `"${tableName}_SEQ".NEXTVAL`;
            }
            
            // 根据数据类型从sampleData中随机取值
            switch (field.dataType) {
                case 'name':
                    return `'${sampleData.names[Math.floor(Math.random() * sampleData.names.length)]}'`;
                case 'address':
                    return `'${sampleData.addresses[Math.floor(Math.random() * sampleData.addresses.length)]}'`;
                case 'email':
                    return `'${sampleData.emails[Math.floor(Math.random() * sampleData.emails.length)]}'`;
                case 'id_card':
                    return `'${sampleData.idCards[Math.floor(Math.random() * sampleData.idCards.length)]}'`;
                case 'phone':
                    return `'${sampleData.phones[Math.floor(Math.random() * sampleData.phones.length)]}'`;
                case 'date':
                    return `TO_TIMESTAMP('${sampleData.dates[Math.floor(Math.random() * sampleData.dates.length)]}', 'YYYY-MM-DD')`;
                default:
                    // 默认根据字段类型生成模拟数据
                    switch (field.type.toLowerCase()) {
                        case 'varchar':
                            return `'${field.name}_${i + 1}'`;
                        case 'int':
                        case 'bigint':
                            return i + 1;
                        case 'datetime':
                            return `TO_TIMESTAMP('${new Date().toISOString().slice(0, 19).replace('T', ' ')}', 'YYYY-MM-DD HH24:MI:SS')`;
                        case 'text':
                            return `'这是${field.name}字段的第${i + 1}条测试数据'`;
                        case 'decimal':
                            return (i + 1) + Math.random().toFixed(2);
                        case 'tinyint':
                            return Math.round(Math.random());
                        default:
                            return 'NULL';
                    }
            }
        });
        
        sql += values.join(', ');
        
        sql += ');\n';
    }
    
    // 显示SQL
    document.getElementById('insert-sql-output').textContent = sql;
}

// 初始化复制按钮
function initCopyButtons() {
    // 获取复制建表SQL按钮
    const copyCreateSqlBtn = document.getElementById('copy-create-sql-btn');
    
    // 为复制建表SQL按钮添加点击事件
    copyCreateSqlBtn.addEventListener('click', function() {
        // 获取SQL输出
        const sqlOutput = document.getElementById('create-sql-output');
        
        // 复制SQL
        copyToClipboard(sqlOutput.textContent, this);
    });
    
    // 获取复制插入SQL按钮
    const copyInsertSqlBtn = document.getElementById('copy-insert-sql-btn');
    
    // 为复制插入SQL按钮添加点击事件
    copyInsertSqlBtn.addEventListener('click', function() {
        // 获取SQL输出
        const sqlOutput = document.getElementById('insert-sql-output');
        
        // 复制SQL
        copyToClipboard(sqlOutput.textContent, this);
    });
}

// 复制到剪贴板
function copyToClipboard(text, button) {
    // 如果文本为空，提示用户
    if (!text || text.includes('点击"生成SQL"按钮')) {
        alert('请先生成SQL');
        return;
    }
    
    // 保存原始按钮文本
    const originalText = button.textContent;
    
    // 复制文本
    navigator.clipboard.writeText(text)
        .then(() => {
            // 更新按钮文本为"已复制"
            button.textContent = '已复制!';
            
            // 1秒后恢复原始文本
            setTimeout(() => {
                button.textContent = originalText;
            }, 1000);
        })
        .catch(err => {
            console.error('复制失败:', err);
            alert('复制失败');
        });

}