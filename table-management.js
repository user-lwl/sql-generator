// 表管理初始化
function initTableManagement() {
    // 渲染表列表
    renderTableList();
    
    // 获取新建表按钮
    const addTableBtn = document.getElementById('add-table-btn');
    
    // 为新建表按钮添加点击事件
    addTableBtn.addEventListener('click', function() {
        // 清空表单
        document.getElementById('table-form').reset();
        
        // 显示模态框
        const tableModal = new bootstrap.Modal(document.getElementById('table-modal'));
        tableModal.show();
    });
    
    // 获取保存表按钮
    const saveTableBtn = document.getElementById('save-table-btn');
    
    // 为保存表按钮添加点击事件
    saveTableBtn.addEventListener('click', function() {
        // 获取表名和表注释
        const tableName = document.getElementById('table-name').value.trim();
        const tableComment = document.getElementById('table-comment').value.trim();
        
        // 验证表单
        if (!tableName) {
            alert('表名不能为空');
            return;
        }
        
        // 获取表数据
        const tables = JSON.parse(localStorage.getItem('sqlfather_tables'));
        
        // 检查表名是否已存在
        if (tables.some(table => table.name === tableName)) {
            alert('表名已存在');
            return;
        }
        
        // 创建新表
        const newTable = {
            id: Date.now().toString(),
            name: tableName,
            comment: tableComment,
            fields: []
        };
        
        // 添加新表
        tables.push(newTable);
        
        // 保存表数据
        localStorage.setItem('sqlfather_tables', JSON.stringify(tables));
        
        // 关闭模态框
        bootstrap.Modal.getInstance(document.getElementById('table-modal')).hide();
        
        // 重新渲染表列表
        renderTableList();
    });
}

// 渲染表列表
function renderTableList() {
    // 获取表列表容器
    const tableListContainer = document.getElementById('table-list');
    
    // 获取表数据
    const tables = JSON.parse(localStorage.getItem('sqlfather_tables'));
    
    // 清空表列表容器
    tableListContainer.innerHTML = '';
    
    // 如果没有表，显示空状态
    if (tables.length === 0) {
        tableListContainer.innerHTML = `
            <div class="empty-state">
                <i class="bi bi-table"></i>
                <p>暂无表，请点击"新建表"按钮创建</p>
            </div>
        `;
        return;
    }
    
    // 遍历表数据，生成表列表
    tables.forEach(table => {
        const tableItem = document.createElement('div');
        tableItem.className = 'table-item';
        tableItem.innerHTML = `
            <div class="table-item-info">
                <h4>${table.name}</h4>
                <p>${table.comment || '无注释'}</p>
            </div>
            <div class="table-item-actions">
                <button class="btn btn-sm btn-outline-primary edit-fields-btn" data-table-id="${table.id}">
                    <i class="bi bi-pencil"></i> 编辑字段
                </button>
                <button class="btn btn-sm btn-outline-danger delete-table-btn" data-table-id="${table.id}">
                    <i class="bi bi-trash"></i> 删除
                </button>
            </div>
        `;
        
        tableListContainer.appendChild(tableItem);
    });
    
    // 为编辑字段按钮添加点击事件
    document.querySelectorAll('.edit-fields-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tableId = this.getAttribute('data-table-id');
            
            // 切换到字段设计页面
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            document.querySelector('[data-page="field-design"]').classList.add('active');
            
            document.querySelectorAll('.content-page').forEach(page => {
                page.classList.remove('active');
            });
            document.getElementById('field-design').classList.add('active');
            
            // 选择对应的表
            const tableSelect = document.getElementById('table-select');
            tableSelect.value = tableId;
            
            // 触发change事件
            const event = new Event('change');
            tableSelect.dispatchEvent(event);
        });
    });
    
    // 为删除表按钮添加点击事件
    document.querySelectorAll('.delete-table-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tableId = this.getAttribute('data-table-id');
            
            // 确认删除
            if (confirm('确定要删除该表吗？')) {
                // 获取表数据
                const tables = JSON.parse(localStorage.getItem('sqlfather_tables'));
                
                // 过滤掉要删除的表
                const filteredTables = tables.filter(table => table.id !== tableId);
                
                // 保存表数据
                localStorage.setItem('sqlfather_tables', JSON.stringify(filteredTables));
                
                // 重新渲染表列表
                renderTableList();
                
                // 更新表选择下拉框
                updateTableSelect();
            }
        });
    });
    
    // 更新表选择下拉框
    updateTableSelect();
}

// 更新表选择下拉框
function updateTableSelect() {
    // 获取表选择下拉框
    const tableSelect = document.getElementById('table-select');
    
    // 获取表数据
    const tables = JSON.parse(localStorage.getItem('sqlfather_tables'));
    
    // 保存当前选中的值
    const currentValue = tableSelect.value;
    
    // 清空下拉框
    tableSelect.innerHTML = '<option value="">请选择表</option>';
    
    // 遍历表数据，生成下拉框选项
    tables.forEach(table => {
        const option = document.createElement('option');
        option.value = table.id;
        option.textContent = `${table.name}${table.comment ? ' (' + table.comment + ')' : ''}`;
        tableSelect.appendChild(option);
    });
    
    // 恢复选中的值
    if (currentValue && tables.some(table => table.id === currentValue)) {
        tableSelect.value = currentValue;
    }
}