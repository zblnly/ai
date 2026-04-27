# Windows SSH Server 安装指南

## 步骤1：安装OpenSSH Server

在PowerShell (管理员) 中执行：

```powershell
Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0
```

## 步骤2：启动SSH服务

```powershell
Start-Service sshd
Set-Service -Name sshd -StartupType Automatic
```

## 步骤3：配置防火墙

```powershell
New-NetFirewallRule -Name sshd -DisplayName "OpenSSH Server" -Enabled True -Direction Inbound -Protocol TCP -Action Allow -LocalPort 22
```

## 步骤4：创建Windows用户密码

在控制面板 → 用户账户 → 管理其他账户 → 添加新用户

或者用命令：
```powershell
net user username password /add
```

---

## 完整复制（一起执行）：

```
Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0
Start-Service sshd
Set-Service -Name sshd -StartupType Automatic
New-NetFirewallRule -Name sshd -DisplayName "OpenSSH Server" -Enabled True -Direction Inbound -Protocol TCP -Action Allow -LocalPort 22
```

---

## 从WSL2连接

```bash
ssh Windows用户名@$(hostname -I | awk '{print $1}')
```

例如：
```bash
ssh admin@192.168.1.100
```

密码就是Windows用户的密码。

---

## 常见问题

| 问题 | 解决 |
|------|------|
| 连接被拒绝 | 检查服务是否启动：`Get-Service sshd` |
| 权限问题 | 使用管理员PowerShell |
| 防火墙阻止 | 已添加规则，如仍不行关闭防火墙测试 |

完成后告诉我，我帮你从WSL2测试连接。