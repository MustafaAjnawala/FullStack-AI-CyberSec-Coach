import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  // Simulating a database fetch with a delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  const courseId = params.id

  // Only return data for the OWASP course (id: 1)
  if (courseId === "1") {
    const course = {
      id: 1,
      title: "OWASP Top 10 Vulnerabilities",
      description: "Learn about the most critical web application security risks and how to mitigate them.",
      instructor: "Dr. Nitin",
      enrolledStudents: 1248,
      duration: "10 weeks",
      rating: 4.8,
      modules: [
        {
          id: 1,
          title: "Broken Access Control",
          description: "Learn about vulnerabilities that allow attackers to bypass authorization mechanisms.",
          completed: false,
          content: {
            videoUrl: "https://example.com/videos/broken-access-control",
            readings: [
              "Broken Access Control occurs when attackers bypass authorization mechanisms to gain unauthorized access to user accounts or sensitive data.",
              "Common examples include Privilege Escalation, Forced Browsing, and CORS Misconfigurations.",
              "Mitigation strategies include enforcing least privilege access, implementing robust access controls, and conducting regular security audits.",
            ],
            exercises: [
              "Identify access control vulnerabilities",
              "Implement proper access control mechanisms",
              "Test access control implementations",
            ],
          },
          subContent: [
            {
              type: "reading",
              title: "Overview of Broken Access Control",
              content: `
                <h2>Broken Access Control</h2>
                <p>Broken Access Control occurs when attackers bypass authorization mechanisms to gain unauthorized access to user accounts or sensitive data.</p>
                
                <h3>Common Examples</h3>
                <ul>
                  <li><strong>Privilege Escalation:</strong> Gaining admin-level access by exploiting misconfigured permissions.</li>
                  <li><strong>Forced Browsing:</strong> Accessing unauthorized pages by manipulating URLs.</li>
                  <li><strong>CORS Misconfigurations:</strong> Allowing unauthorized cross-origin access to resources.</li>
                </ul>
                
                <h3>Mitigation Strategies</h3>
                <ul>
                  <li>Enforce least privilege access.</li>
                  <li>Implement robust access controls.</li>
                  <li>Conduct regular security audits.</li>
                </ul>
              `,
            },
            {
              type: "video",
              title: "Understanding Broken Access Control",
              url: "https://example.com/videos/broken-access-control",
            },
            {
              type: "lab",
              title: "Broken Access Control CTF Challenge",
              url: "https://ctf.hacker101.com/broken-access-control",
            },
          ],
        },
        {
          id: 2,
          title: "Cryptographic Failures",
          description:
            "Understand vulnerabilities that occur when encryption is weak, missing, or improperly implemented.",
          completed: false,
          content: {
            videoUrl: "https://example.com/videos/cryptographic-failures",
            readings: [
              "Cryptographic failures (formerly known as Sensitive Data Exposure) occur when encryption is weak, missing, or improperly implemented.",
              "Common examples include using weak encryption algorithms, exposing data in transit, and poor key management.",
              "Mitigation strategies include using strong encryption algorithms, ensuring data is encrypted both at rest and in transit, and implementing secure key management practices.",
            ],
            exercises: [
              "Identify cryptographic vulnerabilities",
              "Implement proper encryption",
              "Test cryptographic implementations",
            ],
          },
          subContent: [
            {
              type: "reading",
              title: "Overview of Cryptographic Failures",
              content: `
                <h2>Cryptographic Failures</h2>
                <p>Cryptographic failures (formerly known as Sensitive Data Exposure) occur when encryption is weak, missing, or improperly implemented.</p>
                
                <h3>Common Examples</h3>
                <ul>
                  <li><strong>Using Weak Encryption Algorithms:</strong> Outdated ciphers like MD5 and SHA-1.</li>
                  <li><strong>Exposing Data in Transit:</strong> Lack of HTTPS or SSL/TLS encryption.</li>
                  <li><strong>Poor Key Management:</strong> Hardcoded or improperly stored encryption keys.</li>
                </ul>
                
                <h3>Mitigation Strategies</h3>
                <ul>
                  <li>Use strong encryption algorithms.</li>
                  <li>Ensure data is encrypted both at rest and in transit.</li>
                  <li>Implement secure key management practices.</li>
                </ul>
              `,
            },
            {
              type: "video",
              title: "Understanding Cryptographic Failures",
              url: "https://example.com/videos/cryptographic-failures",
            },
            {
              type: "lab",
              title: "Cryptographic Failures CTF Challenge",
              url: "https://ctf.hacker101.com/cryptographic-failures",
            },
          ],
        },
        {
          id: 3,
          title: "Injection Attacks",
          description:
            "Learn about vulnerabilities that occur when untrusted data is sent to an interpreter as part of a command or query.",
          completed: false,
          content: {
            videoUrl: "https://example.com/videos/injection-attacks",
            readings: [
              "Injection attacks occur when untrusted data is sent to an interpreter as part of a command or query.",
              "Common examples include SQL Injection (SQLi), Cross-Site Scripting (XSS), and Command Injection.",
              "Mitigation strategies include using prepared statements and parameterized queries, implementing input validation and sanitization, and employing web application firewalls (WAFs).",
            ],
            exercises: [
              "Identify injection vulnerabilities",
              "Implement proper input validation",
              "Test injection prevention mechanisms",
            ],
          },
          subContent: [
            {
              type: "reading",
              title: "Overview of Injection Attacks",
              content: `
                <h2>Injection Attacks</h2>
                <p>Injection attacks occur when untrusted data is sent to an interpreter as part of a command or query.</p>
                
                <h3>Common Examples</h3>
                <ul>
                  <li><strong>SQL Injection (SQLi):</strong> Exploiting poorly sanitized SQL queries.</li>
                  <li><strong>Cross-Site Scripting (XSS):</strong> Injecting malicious scripts into web pages.</li>
                  <li><strong>Command Injection:</strong> Injecting system commands via user input.</li>
                </ul>
                
                <h3>Mitigation Strategies</h3>
                <ul>
                  <li>Use prepared statements and parameterized queries.</li>
                  <li>Implement input validation and sanitization.</li>
                  <li>Employ web application firewalls (WAFs).</li>
                </ul>
              `,
            },
            {
              type: "video",
              title: "Understanding Injection Attacks",
              url: "https://example.com/videos/injection-attacks",
            },
            {
              type: "lab",
              title: "Injection Attacks CTF Challenge",
              url: "https://ctf.hacker101.com/injection-attacks",
            },
          ],
        },
        {
          id: 4,
          title: "Insecure Design",
          description: "Explore weaknesses in security architecture and risk modeling that lead to vulnerabilities.",
          completed: false,
          content: {
            videoUrl: "https://example.com/videos/insecure-design",
            readings: [
              "Insecure design refers to weaknesses in security architecture and risk modeling, leading to vulnerabilities.",
              "Common examples include lack of threat modeling, weak authentication design, and overly permissive APIs.",
              "Mitigation strategies include incorporating security in the software development life cycle (SDLC), conducting regular design reviews and threat modeling, and enforcing strict access controls.",
            ],
            exercises: [
              "Identify insecure design patterns",
              "Implement secure design principles",
              "Test design security",
            ],
          },
          subContent: [
            {
              type: "reading",
              title: "Overview of Insecure Design",
              content: `
                <h2>Insecure Design</h2>
                <p>Insecure design refers to weaknesses in security architecture and risk modeling, leading to vulnerabilities.</p>
                
                <h3>Common Examples</h3>
                <ul>
                  <li><strong>Lack of Threat Modeling:</strong> Developers fail to anticipate attack vectors.</li>
                  <li><strong>Weak Authentication Design:</strong> Poorly structured authentication workflows.</li>
                  <li><strong>Overly Permissive APIs:</strong> Exposing excessive data or functions.</li>
                </ul>
                
                <h3>Mitigation Strategies</h3>
                <ul>
                  <li>Incorporate security in the software development life cycle (SDLC).</li>
                  <li>Conduct regular design reviews and threat modeling.</li>
                  <li>Enforce strict access controls.</li>
                </ul>
              `,
            },
            {
              type: "video",
              title: "Understanding Insecure Design",
              url: "https://example.com/videos/insecure-design",
            },
            {
              type: "lab",
              title: "Insecure Design CTF Challenge",
              url: "https://ctf.hacker101.com/insecure-design",
            },
          ],
        },
        {
          id: 5,
          title: "Security Misconfiguration",
          description: "Learn about vulnerabilities that occur when security settings are not properly defined.",
          completed: false,
          content: {
            videoUrl: "https://example.com/videos/security-misconfiguration",
            readings: [
              "Security misconfiguration happens when security settings are not properly defined, leaving systems exposed.",
              "Common examples include default credentials, unpatched software, and overexposed debugging features.",
              "Mitigation strategies include regularly updating and patching software, implementing security hardening and automated configuration management, and restricting access to sensitive system configurations.",
            ],
            exercises: [
              "Identify security misconfigurations",
              "Implement proper security configurations",
              "Test configuration security",
            ],
          },
          subContent: [
            {
              type: "reading",
              title: "Overview of Security Misconfiguration",
              content: `
                <h2>Security Misconfiguration</h2>
                <p>Security misconfiguration happens when security settings are not properly defined, leaving systems exposed.</p>
                
                <h3>Common Examples</h3>
                <ul>
                  <li><strong>Default Credentials:</strong> Using default usernames and passwords.</li>
                  <li><strong>Unpatched Software:</strong> Leaving known vulnerabilities unpatched.</li>
                  <li><strong>Overexposed Debugging Features:</strong> Exposing internal system details.</li>
                </ul>
                
                <h3>Mitigation Strategies</h3>
                <ul>
                  <li>Regularly update and patch software.</li>
                  <li>Implement security hardening and automated configuration management.</li>
                  <li>Restrict access to sensitive system configurations.</li>
                </ul>
              `,
            },
            {
              type: "video",
              title: "Understanding Security Misconfiguration",
              url: "https://example.com/videos/security-misconfiguration",
            },
            {
              type: "lab",
              title: "Security Misconfiguration CTF Challenge",
              url: "https://ctf.hacker101.com/security-misconfiguration",
            },
          ],
        },
        {
          id: 6,
          title: "Vulnerable and Outdated Components",
          description: "Understand the risks of using outdated software components with known vulnerabilities.",
          completed: false,
          content: {
            videoUrl: "https://example.com/videos/vulnerable-components",
            readings: [
              "Using outdated software components introduces known vulnerabilities that attackers can exploit.",
              "Common risks include unsupported software, vulnerable third-party libraries, and unpatched systems.",
              "Mitigation strategies include regularly updating all software components, using automated tools to detect vulnerable dependencies, and removing unused and outdated components.",
            ],
            exercises: ["Identify vulnerable components", "Implement component management", "Test component security"],
          },
          subContent: [
            {
              type: "reading",
              title: "Overview of Vulnerable and Outdated Components",
              content: `
                <h2>Vulnerable and Outdated Components</h2>
                <p>Using outdated software components introduces known vulnerabilities that attackers can exploit.</p>
                
                <h3>Common Risks</h3>
                <ul>
                  <li><strong>Unsupported Software:</strong> No longer receiving security updates.</li>
                  <li><strong>Vulnerable Third-Party Libraries:</strong> Insecure dependencies.</li>
                  <li><strong>Unpatched Systems:</strong> Exploited known vulnerabilities.</li>
                </ul>
                
                <h3>Mitigation Strategies</h3>
                <ul>
                  <li>Regularly update all software components.</li>
                  <li>Use automated tools to detect vulnerable dependencies.</li>
                  <li>Remove unused and outdated components.</li>
                </ul>
              `,
            },
            {
              type: "video",
              title: "Understanding Vulnerable Components",
              url: "https://example.com/videos/vulnerable-components",
            },
            {
              type: "lab",
              title: "Vulnerable Components CTF Challenge",
              url: "https://ctf.hacker101.com/vulnerable-components",
            },
          ],
        },
        {
          id: 7,
          title: "Identification and Authentication Failures",
          description: "Learn about weak authentication mechanisms that allow attackers to compromise user identities.",
          completed: false,
          content: {
            videoUrl: "https://example.com/videos/authentication-failures",
            readings: [
              "Weak authentication mechanisms allow attackers to compromise user identities.",
              "Common vulnerabilities include weak password policies, lack of multi-factor authentication (MFA), and session hijacking.",
              "Mitigation strategies include enforcing strong password policies, implementing MFA, and secure session management using secure cookies and token expiration policies.",
            ],
            exercises: [
              "Identify authentication vulnerabilities",
              "Implement secure authentication",
              "Test authentication security",
            ],
          },
          subContent: [
            {
              type: "reading",
              title: "Overview of Identification and Authentication Failures",
              content: `
                <h2>Identification and Authentication Failures</h2>
                <p>Weak authentication mechanisms allow attackers to compromise user identities.</p>
                
                <h3>Common Vulnerabilities</h3>
                <ul>
                  <li><strong>Weak Password Policies:</strong> Allowing easily guessable passwords.</li>
                  <li><strong>Lack of Multi-Factor Authentication (MFA):</strong> Increasing risk of unauthorized access.</li>
                  <li><strong>Session Hijacking:</strong> Attackers stealing session tokens.</li>
                </ul>
                
                <h3>Mitigation Strategies</h3>
                <ul>
                  <li>Enforce strong password policies.</li>
                  <li>Implement MFA.</li>
                  <li>Secure session management using secure cookies and token expiration policies.</li>
                </ul>
              `,
            },
            {
              type: "video",
              title: "Understanding Authentication Failures",
              url: "https://example.com/videos/authentication-failures",
            },
            {
              type: "lab",
              title: "Authentication Failures CTF Challenge",
              url: "https://ctf.hacker101.com/authentication-failures",
            },
          ],
        },
        {
          id: 8,
          title: "Software and Data Integrity Failures",
          description:
            "Explore vulnerabilities that occur when untrusted sources are used for software updates, dependencies, or data exchanges.",
          completed: false,
          content: {
            videoUrl: "https://example.com/videos/integrity-failures",
            readings: [
              "Software and data integrity failures occur when untrusted sources are used for software updates, dependencies, or data exchanges.",
              "Common risks include unverified software updates, code injection via dependencies, and tampered data storage.",
              "Mitigation strategies include using code signing for verifying software integrity, implementing cryptographic verification of data and updates, and storing hashes of critical files for integrity checks.",
            ],
            exercises: [
              "Identify integrity vulnerabilities",
              "Implement integrity checks",
              "Test integrity verification",
            ],
          },
          subContent: [
            {
              type: "reading",
              title: "Overview of Software and Data Integrity Failures",
              content: `
                <h2>Software and Data Integrity Failures</h2>
                <p>This occurs when untrusted sources are used for software updates, dependencies, or data exchanges.</p>
                
                <h3>Common Risks</h3>
                <ul>
                  <li><strong>Unverified Software Updates:</strong> Allowing attackers to insert malicious updates.</li>
                  <li><strong>Code Injection via Dependencies:</strong> Using compromised third-party libraries.</li>
                  <li><strong>Tampered Data Storage:</strong> Attackers modifying stored data.</li>
                </ul>
                
                <h3>Mitigation Strategies</h3>
                <ul>
                  <li>Use code signing for verifying software integrity.</li>
                  <li>Implement cryptographic verification of data and updates.</li>
                  <li>Store hashes of critical files for integrity checks.</li>
                </ul>
              `,
            },
            {
              type: "video",
              title: "Understanding Integrity Failures",
              url: "https://example.com/videos/integrity-failures",
            },
            {
              type: "lab",
              title: "Integrity Failures CTF Challenge",
              url: "https://ctf.hacker101.com/integrity-failures",
            },
          ],
        },
        {
          id: 9,
          title: "Security Logging and Monitoring Failures",
          description: "Learn about the importance of proper logging and monitoring for detecting security breaches.",
          completed: false,
          content: {
            videoUrl: "https://example.com/videos/logging-monitoring",
            readings: [
              "Failure to log and monitor security events can delay or prevent detection of security breaches.",
              "Common vulnerabilities include lack of centralized logging, insufficient monitoring, and weak log protection.",
              "Mitigation strategies include using a Security Information and Event Management (SIEM) system, implementing real-time alerting for suspicious activities, and regularly reviewing and auditing logs.",
            ],
            exercises: ["Identify logging vulnerabilities", "Implement proper logging", "Test monitoring systems"],
          },
          subContent: [
            {
              type: "reading",
              title: "Overview of Security Logging and Monitoring Failures",
              content: `
                <h2>Security Logging and Monitoring Failures</h2>
                <p>Failure to log and monitor security events can delay or prevent detection of security breaches.</p>
                
                <h3>Common Vulnerabilities</h3>
                <ul>
                  <li><strong>Lack of Centralized Logging:</strong> Events scattered across multiple systems.</li>
                  <li><strong>Insufficient Monitoring:</strong> Not detecting suspicious activities.</li>
                  <li><strong>Weak Log Protection:</strong> Logs that can be deleted or altered by attackers.</li>
                </ul>
                
                <h3>Mitigation Strategies</h3>
                <ul>
                  <li>Use a Security Information and Event Management (SIEM) system.</li>
                  <li>Implement real-time alerting for suspicious activities.</li>
                  <li>Regularly review and audit logs.</li>
                </ul>
              `,
            },
            {
              type: "video",
              title: "Understanding Logging and Monitoring",
              url: "https://example.com/videos/logging-monitoring",
            },
            {
              type: "lab",
              title: "Logging and Monitoring CTF Challenge",
              url: "https://ctf.hacker101.com/logging-monitoring",
            },
          ],
        },
        {
          id: 10,
          title: "Server-Side Request Forgery (SSRF)",
          description:
            "Understand vulnerabilities that allow attackers to manipulate server-side requests to access internal resources.",
          completed: false,
          content: {
            videoUrl: "https://example.com/videos/ssrf",
            readings: [
              "SSRF vulnerabilities allow attackers to manipulate server-side requests to access internal resources.",
              "Common exploits include accessing internal systems, extracting metadata from cloud services, and bypassing firewalls.",
              "Mitigation strategies include validating and sanitizing user input to prevent arbitrary requests, implementing allowlist-based URL filtering, and restricting server responses to prevent sensitive data exposure.",
            ],
            exercises: ["Identify SSRF vulnerabilities", "Implement SSRF prevention", "Test SSRF security"],
          },
          subContent: [
            {
              type: "reading",
              title: "Overview of Server-Side Request Forgery (SSRF)",
              content: `
                <h2>Server-Side Request Forgery (SSRF)</h2>
                <p>SSRF vulnerabilities allow attackers to manipulate server-side requests to access internal resources.</p>
                
                <h3>Common Exploits</h3>
                <ul>
                  <li><strong>Accessing Internal Systems:</strong> Attackers use SSRF to reach internal services.</li>
                  <li><strong>Extracting Metadata from Cloud Services:</strong> Exploiting cloud metadata APIs.</li>
                  <li><strong>Bypassing Firewalls:</strong> Sending malicious requests to internal networks.</li>
                </ul>
                
                <h3>Mitigation Strategies</h3>
                <ul>
                  <li>Validate and sanitize user input to prevent arbitrary requests.</li>
                  <li>Implement allowlist-based URL filtering.</li>
                  <li>Restrict server responses to prevent sensitive data exposure.</li>
                </ul>
              `,
            },
            {
              type: "video",
              title: "Understanding SSRF",
              url: "https://example.com/videos/ssrf",
            },
            {
              type: "lab",
              title: "SSRF CTF Challenge",
              url: "https://ctf.hacker101.com/ssrf",
            },
          ],
        },
      ],
      quizCompleted: false,
    }

    return NextResponse.json(course)
  }

  return NextResponse.json({ error: "Course not found" }, { status: 404 })
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const courseId = params.id
  const data = await request.json()

  // In a real app, this would update the database
  // For now, just return success with the updated data

  return NextResponse.json({
    success: true,
    message: `Course ${courseId} updated successfully`,
    data,
  })
}

