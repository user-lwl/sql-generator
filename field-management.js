// 字段管理初始化
function initFieldManagement() {
    // 更新表选择下拉框
    updateTableSelect();
    
    // 获取表选择下拉框
    const tableSelect = document.getElementById('table-select');
    
    // 为表选择下拉框添加change事件
    tableSelect.addEventListener('change', function() {
        // 渲染字段列表
        renderFieldList(this.value);
    });
    
    // 获取添加字段按钮
    const addFieldBtn = document.getElementById('add-field-btn');
    
    // 为添加字段按钮添加点击事件
    addFieldBtn.addEventListener('click', function() {
        // 获取当前选中的表ID
        const tableId = document.getElementById('table-select').value;
        
        // 如果没有选中表，提示用户
        if (!tableId) {
            alert('请先选择一个表');
            return;
        }
        
        // 清空表单
        document.getElementById('field-form').reset();
        
        // 更新字典下拉框
        updateDictSelect();
        
        // 显示模态框
        const fieldModal = new bootstrap.Modal(document.getElementById('field-modal'));
        fieldModal.show();
    });
    
    // 获取保存字段按钮
    const saveFieldBtn = document.getElementById('save-field-btn');
    
    // 为保存字段按钮添加点击事件
    saveFieldBtn.addEventListener('click', function() {
        // 获取当前选中的表ID
        const tableId = document.getElementById('table-select').value;
        
        // 如果没有选中表，提示用户
        if (!tableId) {
            alert('请先选择一个表');
            return;
        }
        
        // 获取字段信息
        const fieldName = document.getElementById('field-name').value.trim();
        const fieldComment = document.getElementById('field-comment').value.trim();
        const fieldType = document.getElementById('field-type').value;
        const fieldLength = document.getElementById('field-length').value.trim();
        const fieldPrimary = document.getElementById('field-primary').checked;
        const fieldNotNull = document.getElementById('field-not-null').checked;
        const fieldAutoIncrement = document.getElementById('field-auto-increment').checked;
        const fieldDefault = document.getElementById('field-default').value.trim();
        const fieldDict = document.getElementById('field-dict').value;
        
        // 验证表单
        if (!fieldName) {
            alert('字段名不能为空');
            return;
        }
        
        // 获取表数据
        const tables = JSON.parse(localStorage.getItem('sqlfather_tables'));
        
        // 找到当前表
        const tableIndex = tables.findIndex(table => table.id === tableId);
        
        // 检查字段名是否已存在
        if (tables[tableIndex].fields.some(field => field.name === fieldName)) {
            alert('字段名已存在');
            return;
        }
        
        // 创建新字段
        const newField = {
            id: Date.now().toString(),
            name: fieldName,
            comment: fieldComment,
            type: fieldType,
            length: fieldLength,
            primary: fieldPrimary,
            notNull: fieldNotNull,
            autoIncrement: fieldAutoIncrement,
            defaultValue: fieldDefault,
            dictId: fieldDict
        };
        
        // 添加新字段
        tables[tableIndex].fields.push(newField);
        
        // 保存表数据
        localStorage.setItem('sqlfather_tables', JSON.stringify(tables));
        
        // 关闭模态框
        bootstrap.Modal.getInstance(document.getElementById('field-modal')).hide();
        
        // 重新渲染字段列表
        renderFieldList(tableId);
    });
}

// 渲染字段列表
function renderFieldList(tableId) {
    // 获取字段列表容器
    const fieldListContainer = document.getElementById('field-list');
    
    // 清空字段列表容器
    fieldListContainer.innerHTML = '';
    
    // 如果没有选中表，显示提示
    if (!tableId) {
        fieldListContainer.innerHTML = `
            <div class="empty-state">
                <i class="bi bi-list-columns"></i>
                <p>请先选择一个表</p>
            </div>
        `;
        return;
    }
    
    // 获取表数据
    const tables = JSON.parse(localStorage.getItem('sqlfather_tables'));
    
    // 找到当前表
    const table = tables.find(table => table.id === tableId);
    
    // 如果表不存在，显示错误
    if (!table) {
        fieldListContainer.innerHTML = `
            <div class="empty-state">
                <i class="bi bi-exclamation-triangle"></i>
                <p>表不存在</p>
            </div>
        `;
        return;
    }
    
    // 如果表没有字段，显示空状态
    if (table.fields.length === 0) {
        fieldListContainer.innerHTML = `
            <div class="empty-state">
                <i class="bi bi-list-columns"></i>
                <p>暂无字段，请点击"添加字段"按钮创建</p>
            </div>
        `;
        return;
    }
    
    // 创建表格
    const table_element = document.createElement('div');
    table_element.className = 'table-responsive';
    table_element.innerHTML = `
        <table class="table table-bordered field-table">
            <thead>
                <tr>
                    <th>字段名</th>
                    <th>类型</th>
                    <th>长度/值</th>
                    <th>主键</th>
                    <th>非空</th>
                    <th>自增</th>
                    <th>默认值</th>
                    <th>注释</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody id="field-table-body">
            </tbody>
        </table>
    `;
    
    fieldListContainer.appendChild(table_element);
    
    // 获取表格主体
    const tableBody = document.getElementById('field-table-body');
    
    // 获取字典数据
    const dicts = JSON.parse(localStorage.getItem('sqlfather_dicts'));
    
    // 遍历字段数据，生成表格行
    table.fields.forEach(field => {
        const tr = document.createElement('tr');
        
        // 查找关联的字典
        let dictName = '';
        if (field.dictId) {
            const dict = dicts.find(dict => dict.id === field.dictId);
            if (dict) {
                dictName = dict.name;
            }
        }
        
        tr.innerHTML = `
            <td>${field.name}</td>
            <td>${field.type.toUpperCase()}</td>
            <td>${field.length || '-'}</td>
            <td>${field.primary ? '✓' : '-'}</td>
            <td>${field.notNull ? '✓' : '-'}</td>
            <td>${field.autoIncrement ? '✓' : '-'}</td>
            <td>${field.defaultValue || '-'}</td>
            <td>${field.comment || '-'}</td>
            <td>
                <button class="btn btn-sm btn-outline-danger delete-field-btn" data-field-id="${field.id}">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        
        tableBody.appendChild(tr);
    });
    
    // 为删除字段按钮添加点击事件
    document.querySelectorAll('.delete-field-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const fieldId = this.getAttribute('data-field-id');
            
            // 确认删除
            if (confirm('确定要删除该字段吗？')) {
                // 获取表数据
                const tables = JSON.parse(localStorage.getItem('sqlfather_tables'));
                
                // 找到当前表
                const tableIndex = tables.findIndex(table => table.id === tableId);
                
                // 过滤掉要删除的字段
                tables[tableIndex].fields = tables[tableIndex].fields.filter(field => field.id !== fieldId);
                
                // 保存表数据
                localStorage.setItem('sqlfather_tables', JSON.stringify(tables));
                
                // 重新渲染字段列表
                renderFieldList(tableId);
            }
        });
    });
}

// 更新字典下拉框
function updateDictSelect() {
    // 获取字典下拉框
    const dictSelect = document.getElementById('field-dict');
    
    // 获取字典数据
    const dicts = JSON.parse(localStorage.getItem('sqlfather_dicts'));
    
    // 保存当前选中的值
    const currentValue = dictSelect.value;
    
    // 清空下拉框
    dictSelect.innerHTML = '<option value="">无</option>';
    
    // 遍历字典数据，生成下拉框选项
    dicts.forEach(dict => {
        const option = document.createElement('option');
        option.value = dict.id;
        option.textContent = dict.name;
        dictSelect.appendChild(option);
    });
    
    // 恢复选中的值
    if (currentValue && dicts.some(dict => dict.id === currentValue)) {
        dictSelect.value = currentValue;
    }
}