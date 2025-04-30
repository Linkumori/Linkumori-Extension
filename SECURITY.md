# SECURITY.md

## Security Policy

Linkumori (Clean URLs) is committed to maintaining the highest security standards for our users. As a privacy-focused browser extension, security is a core principle of our project.

## Reporting a Vulnerability

We take all security vulnerabilities seriously. If you discover a security issue in Linkumori, please follow these steps:

1. **Do not disclose the vulnerability publicly** until it has been addressed by the maintainers
2. Report the issue by creating a new issue on our GitHub repository:
   - Go to: https://github.com/Linkumori/Linkumori-Extension/issues
   - Mark the issue as "Security vulnerability" if such a label exists
   - For highly sensitive vulnerabilities, consider first opening an issue with minimal details and request a private communication channel
3. Include the following information in your report:
   - Type of vulnerability
   - Path or location of the affected code
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if available)

## Security Response Timeline

When a vulnerability is reported, we aim to:

- Acknowledge receipt of the report within 48 hours
- Provide an initial assessment within 7 days
- Release a fix as soon as possible, depending on the severity and complexity

## Security Considerations

Linkumori implements several security-focused features:

### Permissions

- Linkumori requests only the minimum permissions necessary for its functionality
- The extension operates within the standard Chrome extension sandbox
- No user data is collected or transmitted to external servers

### Declarative Net Request (DNR)

- Linkumori uses Chrome's Declarative Net Request API instead of the more powerful webRequest API
- DNR rules operate at the browser level without the ability to read or modify request content
- This approach enhances security by limiting the extension's access to sensitive data

### Data Processing

- All URL cleaning happens locally in the browser
- No user browsing data is stored or transmitted outside the browser
- The extension does not use remote configuration files that could introduce security risks

## Code Security

### Review Process

All code contributions undergo review for:

1. Potential security vulnerabilities
2. Privacy implications
3. Proper implementation of browser security features
4. Adherence to best practices for extension development

### Third-Party Code

Linkumori incorporates code from various sources, each subject to different licenses:

- All third-party libraries are reviewed for vulnerabilities before inclusion
- Attribution is provided for all third-party code (see the License section in README.md)
- When possible, specific versions of dependencies are pinned to prevent automatic updates that might introduce vulnerabilities

## Update Policy

- Security updates are released promptly after vulnerability discovery
- Users are encouraged to keep the extension updated to the latest version
- Major security changes are documented in release notes

## Verification

Users can verify the integrity of the extension by:

1. Reviewing the source code on GitHub before installation
2. Comparing the installed version with the Chrome Web Store version
3. Checking the extension's permissions in the browser's extension settings

## Contact

For security-related inquiries or to report vulnerabilities:
- GitHub: Open an issue on our GitHub repository: https://github.com/Linkumori/Linkumori-Extension/issues

---

This security policy was last updated on May 1, 2025.
