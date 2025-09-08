# SQL Generator

一个简单易用的SQL语句生成工具，支持MySQL和Oracle数据库，可以快速生成建表语句和模拟数据插入语句。

## 项目介绍

SQL Generator是一个基于Web的SQL语句生成工具，旨在帮助开发人员和数据库管理员快速创建数据库表结构和生成测试数据。该工具提供了友好的用户界面，使用户能够通过可视化的方式定义表结构，并自动生成相应的SQL语句。

## 主要功能

- **数据库类型支持**：支持MySQL和Oracle两种主流数据库
- **表结构设计**：可视化定义表名、字段名、字段类型、约束条件等
- **SQL语句生成**：
  - 建表SQL：自动生成创建表的DDL语句
  - 模拟数据SQL：生成包含随机测试数据的INSERT语句
- **数据类型支持**：
  - MySQL：VARCHAR, INT, BIGINT, DATETIME, TEXT, DECIMAL, TINYINT等
  - Oracle：VARCHAR2, NUMBER, CLOB, TIMESTAMP, DATE, CHAR, RAW等
- **字段约束**：支持主键、非空、唯一、自增等约束条件
- **模拟数据生成**：支持多种数据类型的随机数据生成，包括：
  - 姓名
  - 地址
  - 电子邮箱
  - 身份证号
  - 手机号
  - 日期
  - 固定值
- **一键复制**：快速复制生成的SQL语句到剪贴板

## 使用方法

1. **设置数据库信息**：
   - 选择数据库类型（MySQL/Oracle）
   - 输入数据库名称（可选）

2. **定义表结构**：
   - 输入表名和表注释
   - 添加字段并设置字段属性（名称、类型、长度、约束条件等）
   - 可以添加多个字段

3. **生成SQL**：
   - 点击"生成SQL"按钮
   - 查看生成的建表SQL和模拟数据SQL
   - 可以调整模拟数据的生成数量

4. **复制SQL**：
   - 点击相应的"复制"按钮将SQL语句复制到剪贴板

## 技术栈

- HTML5
- CSS3
- JavaScript (原生)
- Bootstrap 5.3.0
- Bootstrap Icons 1.10.0

## 本地运行

1. 克隆项目到本地
   ```
   git clone https://github.com/user-lwl/sql-generator.git
   ```

2. 使用浏览器打开index.html文件
   ```
   cd sql-generator
   open index.html  # 或者直接在文件浏览器中双击打开
   ```

## 项目结构

- `index.html` - 主页面HTML结构
- `styles.css` - 样式表文件
- `app.js` - 主应用逻辑
- `data.js` - 模拟数据定义
- `sql-generator.js` - SQL生成核心逻辑
- `field-management.js` - 字段管理相关功能
- `table-management.js` - 表管理相关功能
- `dict-management.js` - 数据字典管理功能

## 贡献指南

欢迎对项目进行贡献！如果您有任何改进建议或发现了bug，请提交issue或pull request。

## 联系方式

- 作者：[user-lwl](https://github.com/user-lwl)
- 网站：[SQL Generator](https://sql.user-lwl.icu/)
