# Security Policy

## Overview
This document outlines the security measures implemented in the World History Archive project.

## Security Measures Implemented

### 1. Security Headers
The following security headers are configured in `next.config.ts`:
- **Strict-Transport-Security**: Forces HTTPS connections
- **X-Frame-Options**: Prevents clickjacking attacks
- **X-Content-Type-Options**: Prevents MIME type sniffing
- **X-XSS-Protection**: Enables browser XSS protection
- **Referrer-Policy**: Controls referrer information
- **Permissions-Policy**: Restricts access to browser features

### 2. Network Security
- Development server runs on `localhost (127.0.0.1)` only by default
- Port 3000 is restricted to local access
- No external database connections required (static site)

### 3. Environment Variables
- `.env.local` file for sensitive configurations (not committed to git)
- Telemetry disabled for privacy
- All environment files are in `.gitignore`

### 4. Static Export
- Application exports to static HTML/CSS/JS
- No server-side runtime vulnerabilities
- Can be hosted on secure CDNs

### 5. Dependencies
Run regular security audits:
```bash
npm audit
npm audit fix
```

## Development Best Practices

### Running Locally
```bash
# Always run on localhost only
npm run dev
```
The dev server will only be accessible from `http://localhost:3000`

### Production Deployment
When deploying to production (GitHub Pages, etc.):
1. Ensure HTTPS is enabled
2. Configure security headers on your hosting platform
3. Use a Content Security Policy (CSP)
4. Enable HSTS on your domain

## Exposed Ports (Development Environment)

⚠️ **Warning**: The following ports are exposed in this development container:
- **Port 2000**: VS Code dev port (managed by GitHub Codespaces)
- **Port 2222**: SSH (managed by GitHub Codespaces)

These are controlled by the development environment and should not be exposed in production.

## Reporting Security Issues

If you discover a security vulnerability, please report it to the repository owner via:
- GitHub Issues (for non-critical issues)
- Email (for critical vulnerabilities)

## Updates

Last updated: December 21, 2025

## Recommendations

1. **Keep dependencies updated**: Run `npm update` regularly
2. **Audit regularly**: Use `npm audit` to check for vulnerabilities
3. **Review code**: Perform code reviews before merging
4. **Restrict access**: Only expose necessary ports
5. **Use HTTPS**: Always serve over HTTPS in production
6. **Monitor logs**: Keep track of access logs if available
7. **Input validation**: Always validate and sanitize user inputs (if adding forms)
8. **Rate limiting**: Consider implementing rate limiting for API routes (if added)
