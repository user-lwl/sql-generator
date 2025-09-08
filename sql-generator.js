// SQL生成初始化
function initSqlGenerator() {
    // 获取生成SQL按钮
    const generateSqlBtn = document.getElementById('generate-sql-btn');
    
    // 为生成SQL按钮添加点击事件
    generateSqlBtn.addEventListener('click', function() {
        // 获取SQL类型
        const sqlType = document.getElementById('sql-type').value;
        
        // 根据SQL类型生成SQL
        switch (sqlType) {
            case 'create':
                generateCreateTableSql();
                break;
            case 'insert':
                generateInsertSql();
                break;
            case 'select':
                generateSelectSql();
                break;
            case 'update':
                generateUpdateSql();
                break;
            case 'delete':
                generateDeleteSql();
                break;
        }
    });
    
    // 获取复制SQL按钮
    const copySqlBtn = document.getElementById('copy-sql-btn');
    
    // 为复制SQL按钮添加点击事件
    copySqlBtn.addEventListener('click', function() {
        // 获取SQL输出
        const sqlOutput = document.getElementById('sql-output');
        
        // 如果SQL输出为空，提示用户
        if (!sqlOutput.textContent) {
            alert('请先生成SQL');
            return;
        }
        
        // 复制SQL
        navigator.clipboard.writeText(sqlOutput.textContent)
            .then(() => {
                // 添加复制成功动画
                this.classList.add('copy-success');
                
                // 1秒后移除动画类
                setTimeout(() => {
                    this.classList.remove('copy-success');
                }, 1000);
            })
            .catch(err => {
                console.error('复制失败:', err);
                alert('复制失败');
            });
    });
}

// 生成建表SQL
function generateCreateTableSql() {
    // 获取表数据
    const tables = JSON.parse(localStorage.getItem('sqlfather_tables'));
    
    // 如果没有表，提示用户
    if (tables.length === 0) {
        alert('请先创建表');
        return;
    }
    
    // 生成SQL
    let sql = '';
    
    // 遍历表
    tables.forEach(table => {
        // 如果表没有字段，跳过
        if (table.fields.length === 0) {
            return;
        }
        
        // 添加建表语句
        sql += `-- ${table.comment || '无注释'}\n`;
        sql += `CREATE TABLE \`${table.name}\` (\n`;
        
        // 添加字段
        const fieldSqls = [];
        let primaryKeys = [];
        
        // 遍历字段
        table.fields.forEach(field => {
            let fieldSql = `  \`${field.name}\` ${field.type.toUpperCase()}`;
            
            // 添加长度
            if (field.length) {
                fieldSql += `(${field.length})`;
            }
            
            // 添加非空约束
            if (field.notNull) {
                fieldSql += ' NOT NULL';
            }
            
            // 添加自增约束
            if (field.autoIncrement) {
                fieldSql += ' AUTO_INCREMENT';
            }
            
            // 添加默认值
            if (field.defaultValue) {
                fieldSql += ` DEFAULT ${field.defaultValue}`;
            }
            
            // 添加注释
            if (field.comment) {
                fieldSql += ` COMMENT '${field.comment}'`;
            }
            
            // 添加到字段SQL列表
            fieldSqls.push(fieldSql);
            
            // 如果是主键，添加到主键列表
            if (field.primary) {
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
        
        if (table.comment) {
            sql += ` COMMENT='${table.comment}'`;
        }
        
        sql += ';\n\n';
    });
    
    // 显示SQL
    document.getElementById('sql-output').textContent = sql;
}

// 生成插入SQL
function generateInsertSql() {
    // 获取表数据
    const tables = JSON.parse(localStorage.getItem('sqlfather_tables'));
    
    // 如果没有表，提示用户
    if (tables.length === 0) {
        alert('请先创建表');
        return;
    }
    
    // 生成SQL
    let sql = '';
    
    // 遍历表
    tables.forEach(table => {
        // 如果表没有字段，跳过
        if (table.fields.length === 0) {
            return;
        }
        
        // 添加插入语句
        sql += `-- ${table.comment || '无注释'}\n`;
        sql += `INSERT INTO \`${table.name}\` (`;
        
        // 添加字段名
        const fieldNames = table.fields.map(field => `\`${field.name}\``);
        sql += fieldNames.join(', ');
        
        sql += ') VALUES (';
        
        // 添加占位符
        const placeholders = table.fields.map(field => {
            // 如果有关联字典，生成随机值
            if (field.dictId) {
                const dicts = JSON.parse(localStorage.getItem('sqlfather_dicts'));
                const dict = dicts.find(dict => dict.id === field.dictId);
                
                if (dict && dict.items.length > 0) {
                    const randomItem = dict.items[Math.floor(Math.random() * dict.items.length)];
                    return `'${randomItem.value}'`;
                }
            }
            
            // 根据字段类型生成占位符
            switch (field.type.toLowerCase()) {
                case 'varchar':
                case 'text':
                    return `'${field.name}_value'`;
                case 'int':
                case 'bigint':
                    return field.autoIncrement ? 'NULL' : '0';
                case 'datetime':
                    return 'NOW()';
                case 'decimal':
                    return '0.00';
                case 'tinyint':
                    return '0';
                default:
                    return 'NULL';
            }
        });
        
        sql += placeholders.join(', ');
        
        sql += ');\n\n';
    });
    
    // 显示SQL
    document.getElementById('sql-output').textContent = sql;
}

// 生成查询SQL
function generateSelectSql() {
    // 获取表数据
    const tables = JSON.parse(localStorage.getItem('sqlfather_tables'));
    
    // 如果没有表，提示用户
    if (tables.length === 0) {
        alert('请先创建表');
        return;
    }
    
    // 生成SQL
    let sql = '';
    
    // 遍历表
    tables.forEach(table => {
        // 如果表没有字段，跳过
        if (table.fields.length === 0) {
            return;
        }
        
        // 添加查询语句
        sql += `-- ${table.comment || '无注释'}\n`;
        sql += `SELECT\n`;
        
        // 添加字段
        const fieldSelects = table.fields.map(field => {
            return `  \`${field.name}\`${field.comment ? ` AS '${field.comment}'` : ''}`;
        });
        
        sql += fieldSelects.join(',\n');
        
        sql += `\nFROM \`${table.name}\`\n`;
        
        // 添加WHERE条件
        const primaryFields = table.fields.filter(field => field.primary);
        if (primaryFields.length > 0) {
            sql += `WHERE \`${primaryFields[0].name}\` = 1\n`;
        }
        
        sql += `LIMIT 10;\n\n`;
    });
    
    // 显示SQL
    document.getElementById('sql-output').textContent = sql;
}

// 生成更新SQL
function generateUpdateSql() {
    // 获取表数据
    const tables = JSON.parse(localStorage.getItem('sqlfather_tables'));
    
    // 如果没有表，提示用户
    if (tables.length === 0) {
        alert('请先创建表');
        return;
    }
    
    // 生成SQL
    let sql = '';
    
    // 遍历表
    tables.forEach(table => {
        // 如果表没有字段，跳过
        if (table.fields.length === 0) {
            return;
        }
        
        // 添加更新语句
        sql += `-- ${table.comment || '无注释'}\n`;
        sql += `UPDATE \`${table.name}\`\nSET\n`;
        
        // 添加SET子句
        const setStatements = table.fields
            .filter(field => !field.primary) // 排除主键
            .map(field => {
                // 根据字段类型生成值
                let value;
                switch (field.type.toLowerCase()) {
                    case 'varchar':
                    case 'text':
                        value = `'${field.name}_new_value'`;
                        break;
                    case 'int':
                    case 'bigint':
                        value = '1';
                        break;
                    case 'datetime':
                        value = 'NOW()';
                        break;
                    case 'decimal':
                        value = '1.00';
                        break;
                    case 'tinyint':
                        value = '1';
                        break;
                    default:
                        value = 'NULL';
                }
                
                return `  \`${field.name}\` = ${value}`;
            });
        
        sql += setStatements.join(',\n');
        
        // 添加WHERE条件
        const primaryFields = table.fields.filter(field => field.primary);
        if (primaryFields.length > 0) {
            sql += `\nWHERE \`${primaryFields[0].name}\` = 1;\n\n`;
        } else {
            sql += `\nWHERE 1 = 1\nLIMIT 1;\n\n`;
        }
    });
    
    // 显示SQL
    document.getElementById('sql-output').textContent = sql;
}

// 生成删除SQL
function generateDeleteSql() {
    // 获取表数据
    const tables = JSON.parse(localStorage.getItem('sqlfather_tables'));
    
    // 如果没有表，提示用户
    if (tables.length === 0) {
        alert('请先创建表');
        return;
    }
    
    // 生成SQL
    let sql = '';
    
    // 遍历表
    tables.forEach(table => {
        // 如果表没有字段，跳过
        if (table.fields.length === 0) {
            return;
        }
        
        // 添加删除语句
        sql += `-- ${table.comment || '无注释'}\n`;
        sql += `DELETE FROM \`${table.name}\`\n`;
        
        // 添加WHERE条件
        const primaryFields = table.fields.filter(field => field.primary);
        if (primaryFields.length > 0) {
            sql += `WHERE \`${primaryFields[0].name}\` = 1;\n\n`;
        } else {
            sql += `WHERE 1 = 1\nLIMIT 1;\n\n`;
        }
    });
    
    // 显示SQL
    document.getElementById('sql-output').textContent = sql;
}