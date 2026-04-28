# Hermes Agent Windows 控制指南

> ⚠️ 安全警告：谨慎开启，勿授予不信任的Agent

## 方案1：从WSL2调用Windows命令

在WSL2中安装Hermes后，可以配置调用Windows命令：

```bash
# 在WSL2中，编辑Hermes配置
nano ~/.hermes/config.yaml

# 添加Windows命令执行
shell:
  windows: true
  executor: powershell.exe  # 或 cmd.exe
```

**可用命令示例：**
```bash
# 打开Windows程序
hermes exec "notepad.exe"
hermes exec "calc.exe"

# 文件操作 (受限)
hermes exec "dir C:\\Users"
hermes exec "type C:\\test\\file.txt"
```

**限制：**
- 只能执行，无法作为后台服务
- 需要每次确认
- 无法实现真正的"控制"

---

## 方案2：使用SSH反向连接

在Windows上安装OpenSSHServer，WSL2通过SSH控制：

```powershell
# 以管理员身份运行Windows PowerShell
Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0

# 启动SSH服务
Start-Service sshd

# 配置 firewall
New-NetFirewallRule -Name sshd -DisplayName 'OpenSSH Server' -Enabled True -Direction Inbound -Protocol TCP -Action Allow -LocalPort 22
```

```bash
# 从WSL2连接Windows
ssh user@windows-ip
```

---

## 方案3：API/Web服务模式 (推荐)

在Windows上运行一个轻量API服务，WSL2的Hermes通过API调用：

```python
# windows_control_api.py (Windows端)
from flask import Flask, request, jsonify
import subprocess
import os

app = Flask(__name__)

@app.route('/execute', methods=['POST'])
def execute():
    cmd = request.json.get('command')
    # 白名单检查
    allowed = ['dir', 'type', 'echo', 'whoami']
    if cmd.split()[0] not in allowed:
        return jsonify({'error': 'Command not allowed'}), 403
    
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    return jsonify({'output': result.stdout, 'error': result.stderr})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

---

## ⚠️ 安全建议

1. **绝对不要**给Agent完全控制权限
2. 使用白名单命令
3. 敏感操作（如删除文件、格式化）必须手动确认
4. 考虑使用容器隔离

---

## 最安全的替代方案

对于Windows上的AI Agent控制，建议使用：

| 工具 | 平台 | 特点 |
|------|------|------|
| **Windows Subsystem for Android (WSA)** | Windows | 隔离Android环境 |
| **Docker容器** | Windows | 完全隔离 |
| **Remote Desktop API** | Windows | 仅限远程桌面 |

---

## 结论

不建议让WSL2中的Hermes直接控制Windows主机。

**推荐：**
1. 仅在WSL2中运行AI推理
2. 需要的Windows操作通过Web API手动触发
3. 或者直接用Windows原生方式运行Hermes（Docker）

需要我帮你配置哪种方案？