// 字典管理初始化
function initDictManagement() {
    // 渲染字典列表
    renderDictList();
    
    // 获取添加字典按钮
    const addDictBtn = document.getElementById('add-dict-btn');
    
    // 为添加字典按钮添加点击事件
    addDictBtn.addEventListener('click', function() {
        // 清空表单
        document.getElementById('dict-form').reset();
        
        // 清空字典项
        document.getElementById('dict-items').innerHTML = `
            <div class="dict-item row mb-2">
                <div class="col-5">
                    <input type="text" class="form-control dict-item-value" placeholder="值">
                </div>
                <div class="col-5">
                    <input type="text" class="form-control dict-item-label" placeholder="标签">
                </div>
                <div class="col-2">
                    <button type="button" class="btn btn-danger remove-dict-item">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        `;
        
        // 为删除字典项按钮添加点击事件
        addRemoveDictItemEvent();
        
        // 显示模态框
        const dictModal = new bootstrap.Modal(document.getElementById('dict-modal'));
        dictModal.show();
    });
    
    // 获取添加字典项按钮
    const addDictItemBtn = document.getElementById('add-dict-item-btn');
    
    // 为添加字典项按钮添加点击事件
    addDictItemBtn.addEventListener('click', function() {
        // 创建新字典项
        const dictItem = document.createElement('div');
        dictItem.className = 'dict-item row mb-2';
        dictItem.innerHTML = `
            <div class="col-5">
                <input type="text" class="form-control dict-item-value" placeholder="值">
            </div>
            <div class="col-5">
                <input type="text" class="form-control dict-item-label" placeholder="标签">
            </div>
            <div class="col-2">
                <button type="button" class="btn btn-danger remove-dict-item">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;
        
        // 添加到字典项容器
        document.getElementById('dict-items').appendChild(dictItem);
        
        // 为删除字典项按钮添加点击事件
        addRemoveDictItemEvent();
    });
    
    // 获取保存字典按钮
    const saveDictBtn = document.getElementById('save-dict-btn');
    
    // 为保存字典按钮添加点击事件
    saveDictBtn.addEventListener('click', function() {
        // 获取字典名称
        const dictName = document.getElementById('dict-name').value.trim();
        
        // 验证表单
        if (!dictName) {
            alert('字典名称不能为空');
            return;
        }
        
        // 获取字典项
        const dictItemElements = document.querySelectorAll('.dict-item');
        const dictItems = [];
        
        // 遍历字典项
        dictItemElements.forEach(element => {
            const valueInput = element.querySelector('.dict-item-value');
            const labelInput = element.querySelector('.dict-item-label');
            
            const value = valueInput.value.trim();
            const label = labelInput.value.trim();
            
            // 如果值和标签都不为空，添加到字典项列表
            if (value && label) {
                dictItems.push({
                    value,
                    label
                });
            }
        });
        
        // 如果没有有效的字典项，提示用户
        if (dictItems.length === 0) {
            alert('请至少添加一个有效的字典项');
            return;
        }
        
        // 获取字典数据
        const dicts = JSON.parse(localStorage.getItem('sqlfather_dicts'));
        
        // 检查字典名称是否已存在
        if (dicts.some(dict => dict.name === dictName)) {
            alert('字典名称已存在');
            return;
        }
        
        // 创建新字典
        const newDict = {
            id: Date.now().toString(),
            name: dictName,
            items: dictItems
        };
        
        // 添加新字典
        dicts.push(newDict);
        
        // 保存字典数据
        localStorage.setItem('sqlfather_dicts', JSON.stringify(dicts));
        
        // 关闭模态框
        bootstrap.Modal.getInstance(document.getElementById('dict-modal')).hide();
        
        // 重新渲染字典列表
        renderDictList();
        
        // 更新字典下拉框
        updateDictSelect();
    });
}

// 渲染字典列表
function renderDictList() {
    // 获取字典列表容器
    const dictListContainer = document.getElementById('dict-list');
    
    // 获取字典数据
    const dicts = JSON.parse(localStorage.getItem('sqlfather_dicts'));
    
    // 清空字典列表容器
    dictListContainer.innerHTML = '';
    
    // 如果没有字典，显示空状态
    if (dicts.length === 0) {
        dictListContainer.innerHTML = `
            <div class="empty-state">
                <i class="bi bi-journal-text"></i>
                <p>暂无字典，请点击"添加字典"按钮创建</p>
            </div>
        `;
        return;
    }
    
    // 遍历字典数据，生成字典列表
    dicts.forEach(dict => {
        const dictCard = document.createElement('div');
        dictCard.className = 'card mb-3';
        
        // 生成字典项表格
        let dictItemsHtml = '';
        if (dict.items.length > 0) {
            dictItemsHtml = `
                <table class="table table-bordered mb-0">
                    <thead>
                        <tr>
                            <th>值</th>
                            <th>标签</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${dict.items.map(item => `
                            <tr>
                                <td>${item.value}</td>
                                <td>${item.label}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        } else {
            dictItemsHtml = `
                <div class="empty-state">
                    <p>暂无字典项</p>
                </div>
            `;
        }
        
        dictCard.innerHTML = `
            <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0">${dict.name}</h5>
                <button class="btn btn-sm btn-outline-danger delete-dict-btn" data-dict-id="${dict.id}">
                    <i class="bi bi-trash"></i> 删除
                </button>
            </div>
            <div class="card-body p-0">
                ${dictItemsHtml}
            </div>
        `;
        
        dictListContainer.appendChild(dictCard);
    });
    
    // 为删除字典按钮添加点击事件
    document.querySelectorAll('.delete-dict-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const dictId = this.getAttribute('data-dict-id');
            
            // 确认删除
            if (confirm('确定要删除该字典吗？')) {
                // 获取字典数据
                const dicts = JSON.parse(localStorage.getItem('sqlfather_dicts'));
                
                // 过滤掉要删除的字典
                const filteredDicts = dicts.filter(dict => dict.id !== dictId);
                
                // 保存字典数据
                localStorage.setItem('sqlfather_dicts', JSON.stringify(filteredDicts));
                
                // 重新渲染字典列表
                renderDictList();
                
                // 更新字典下拉框
                updateDictSelect();
            }
        });
    });
}

// 为删除字典项按钮添加点击事件
function addRemoveDictItemEvent() {
    document.querySelectorAll('.remove-dict-item').forEach(btn => {
        btn.addEventListener('click', function() {
            // 获取字典项元素
            const dictItem = this.closest('.dict-item');
            
            // 如果不是第一个字典项，则删除
            if (dictItem.parentElement.children.length > 1) {
                dictItem.remove();
            }
        });
    });
}