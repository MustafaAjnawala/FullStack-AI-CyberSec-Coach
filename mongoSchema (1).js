const mongoose = require('mongoose');

// Schema for main content
const contentSchema = new mongoose.Schema({
    heading: { type: String, required: true },
    content: { type: String, required: true }
});

// Schema for subtopics (e.g., 1.1.1)
const subtopicSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: [contentSchema]
});

// Schema for topics under the particular module (e.g., 1.1)
const topicSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subtopics: [subtopicSchema]
});

// Schema for levels
const levelSchema = new mongoose.Schema({
    level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], required: true },
    topics: [topicSchema]
});

// Schema for modules within a course (e.g., Broken Access Control)
const moduleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    overview: { type: String, required: true },
    levels: [levelSchema]
});

// Schema for courses (e.g., OWASP Top 10 Vuln.)
const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    modules: [moduleSchema]
});

// Example document for a module
const sampleModule = {
    title: "Broken Access Control",
    overview: "Covers techniques and risks of improper access enforcement.",
    levels: [
        {
            level: "Beginner",
            topics: [
                {
                    title: "Introduction to Access Control",
                    subtopics: [
                        {
                            title: "What is Access Control?",
                            content: [
                                {
                                    heading: "Definition",
                                    content: "Access control is a security mechanism that regulates who or what can view or use resources in a computing environment. It is a fundamental component of information security, ensuring confidentiality, integrity, and availability."
                                },
                                {
                                    heading: "Core Concepts",
                                    content: "The core concepts of access control include Subject, Object, Action, and Policy."
                                }
                            ]
                        },
                        {
                            title: "Core Concepts",
                            content: [
                                {
                                    heading: "Subject",
                                    content: "An active entity that requests access to an object. Examples include a user, a process, a device, or a system. A subject is the entity that initiates an action or request. It can be a person, a program, or a device. In access control, it's crucial to identify and authenticate subjects accurately. Examples: A user typing their credentials to log in, a program trying to read a file, a device sending a request to a server."
                                },
                                {
                                    heading: "Object",
                                    content: "A passive entity that contains information or provides a service. Examples include a file, a directory, a database record, a web page, a function, an API endpoint, or a network resource. An object is the resource that a subject wants to access. Objects need to be protected from unauthorized access. Examples: A file containing sensitive data, a database storing user information, a web page displaying confidential information, an API endpoint that performs a critical operation."
                                },
                                {
                                    heading: "Action",
                                    content: "An operation that a subject can perform on an object. Common actions include read, write, execute, delete, modify, access, create, update, and administer. An action is the specific operation that a subject wants to perform on an object. Access control systems define which actions are allowed for which subjects on which objects. Examples: A user reading a file, a program writing to a database, a user executing a program, an administrator deleting a user account."
                                },
                                {
                                    heading: "Policy",
                                    content: "A set of rules that define the allowed actions for subjects on objects. Access control policies are the core of access control systems. Access control policies are the rules that govern whether access is granted or denied. Policies can be based on various factors, such as the identity of the subject, the role of the subject, the attributes of the subject or object, the context of the access request. Examples: 'Only administrators can delete user accounts,' 'Users can only access their own files,' 'Access is allowed only during business hours.'"
                                }
                            ]
                        },
                        {
                            title: "Analogy",
                            content: [
                                {
                                    heading: "Building Analogy",
                                    content: "Imagine a building with different rooms. Access control determines who can enter the building, which rooms they can enter, and what they can do inside each room (e.g., read a book, use a computer, access a safe, or clean the room). The building represents the system or resource, the people represent the subjects, the rooms represent the objects, the keys and security guards represent the access control mechanisms, the rules about who can enter which rooms represent the access control policies."
                                }
                            ]
                        }
                    ]
                },
                {
                    title: "Authentication vs Authorization",
                    subtopics: [
                        {
                            title: "Authentication",
                            content: [
                                {
                                    heading: "Definition",
                                    content: "The process of verifying the identity of a subject. It answers the question, 'Who are you?' Authentication is the process of confirming that a subject is who they claim to be. It's about verifying credentials and establishing trust. Authentication precedes authorization; you must know who someone is before you can decide what they can do."
                                },
                                {
                                    heading: "MFA",
                                    content: "Multi-Factor Authentication requires multiple credentials. MFA enhances security by requiring users to provide more than one type of authentication factor. This makes it much harder for attackers to gain unauthorized access, even if one factor is compromised. Authentication Factors: Something you know (e.g., password, PIN, security questions), Something you have (e.g., one-time code from an authenticator app, a hardware token, a smart card), Something you are (e.g., biometric authentication such as fingerprint or facial recognition)."
                                },
                                {
                                    heading: "Biometric Authentication",
                                    content: "Uses fingerprints, facial recognition, etc. Biometric authentication uses biological traits for identification. It offers a convenient and often secure way to authenticate users. Types: Fingerprint scanning, Facial recognition, Iris scanning, Voice recognition. Concerns: Privacy concerns, Potential for data breaches, Difficulty in changing biometrics, Accuracy and reliability."
                                },
                                {
                                    heading: "Usernames and Passwords",
                                    content: "The most common method, but also the most vulnerable. Users provide a username (or email address) and a secret password to verify their identity. This method is widely used but susceptible to various attacks. Vulnerabilities: Password guessing and brute-force attacks, Phishing, Keylogging, Social engineering, Dictionary attacks."
                                },
                                {
                                    heading: "Digital Certificates",
                                    content: "Electronic documents that verify the identity of a user, website, or device. Digital certificates use public-key cryptography to verify identity. They are issued by trusted authorities and provide a high level of assurance. Use Cases: HTTPS, Code signing, Secure email, Client authentication."
                                },
                                {
                                    heading: "Smart Cards",
                                    content: "Physical cards with embedded chips that store user credentials. Smart cards contain integrated circuits that can store and process data. They provide a secure way to store user credentials and other sensitive information. Use Cases: Government IDs, Banking cards, Physical access control."
                                }
                            ]
                        },
                        {
                            title: "Importance",
                            content: [
                                {
                                    heading: "Role in Security",
                                    content: "Authentication is a prerequisite for authorization. You must know who a user is before you can determine what they are allowed to do. Without proper authentication, authorization is meaningless."
                                }
                            ]
                        },
                        {
                            title: "Authorization",
                            content: [
                                {
                                    heading: "Definition",
                                    content: "The process of determining what actions an authenticated subject is allowed to perform on a specific object. It answers the question, 'What are you allowed to do?' Authorization determines the level of access granted to a user after they have been authenticated. It defines the specific permissions and restrictions placed on their actions. Authorization is about granting or denying access to specific resources or functionalities based on the user's identity, role, or other attributes."
                                },
                                {
                                    heading: "Examples",
                                    content: "Allowing a user to read a file but not modify it. Granting an administrator the ability to delete user accounts. Restricting access to a web page based on user role or group membership."
                                }
                            ]
                        }
                    ]
                },
                {
                    title: "Fundamental Principles",
                    subtopics: [
                        {
                            title: "Least Privilege",
                            content: [
                                {
                                    heading: "Definition",
                                    content: "Granting each subject only the minimum access necessary to perform its required functions. The principle of least privilege dictates that a user, program, or process should be given only the minimum privileges required to complete its task. This limits the potential damage if a subject is compromised. It's about minimizing the 'blast radius' of a security breach."
                                },
                                {
                                    heading: "Rationale",
                                    content: "Limits the impact of a security breach. If an attacker gains control of a user's account, the damage they can cause is limited to the privileges held by that account. If an account has minimal privileges, even if compromised, the attacker's actions are constrained."
                                },
                                {
                                    heading: "Implementation",
                                    content: "Regularly review and restrict user permissions. Implement Role-Based Access Control (RBAC) to manage user privileges. Use Attribute-Based Access Control (ABAC) for fine-grained access control. Apply privilege bracketing: temporarily elevate privileges only when needed."
                                }
                            ]
                        },
                        {
                            title: "Separation of Duties",
                            content: [
                                {
                                    heading: "Definition",
                                    content: "Dividing critical tasks among different subjects to prevent fraud or errors. Separation of duties prevents any single individual from having complete control over a critical process or transaction. This reduces the risk of fraud, errors, and abuse. It's about introducing checks and balances to prevent single points of failure or malicious actions."
                                },
                                {
                                    heading: "Rationale",
                                    content: "Ensures that multiple individuals are involved in sensitive processes, making it harder for any one person to act maliciously or make mistakes. Collusion becomes necessary for wrongdoing, which is harder to achieve than individual actions."
                                },
                                {
                                    heading: "Example",
                                    content: "In financial transactions, the person who initiates a payment should not be the same person who approves it. This requires collusion to commit fraud."
                                }
                            ]
                        },
                        {
                            title: "Defense in Depth",
                            content: [
                                {
                                    heading: "Definition",
                                    content: "Implementing multiple layers of security controls to protect resources. Defense in depth involves using a combination of security measures to protect assets. If one layer fails, others are still in place to provide protection. It's about creating redundancy in security to increase resilience."
                                },
                                {
                                    heading: "Rationale",
                                    content: "Increases the complexity and difficulty for an attacker to compromise a system. Attackers have to bypass multiple layers, making their task much harder."
                                },
                                {
                                    heading: "Example",
                                    content: "Using both authentication and authorization, along with input validation, network segmentation, firewalls, intrusion detection systems, and logging/monitoring."
                                }
                            ]
                        }
                    ]
                },
                {
                    title: "Common Access Control Scenarios",
                    subtopics: [
                        {
                            title: "Web Applications",
                            content: [
                                {
                                    heading: "User Login and Session Management",
                                    content: "Controlling access to user accounts and maintaining user sessions securely. Authentication to verify user identity (e.g., username/password, MFA). Session management to track user activity and maintain login status (e.g., session IDs, cookies). Protecting session IDs from theft or manipulation (e.g., HTTPS, secure cookies). Vulnerabilities: Session hijacking, Session fixation, Predictable session IDs."
                                },
                                {
                                    heading: "Access to Different Pages or Functionalities",
                                    content: "Restricting access to administrative functions, user profiles, or other resources based on user privileges. Different user roles (e.g., administrator, editor, user) have different access levels. Authorization mechanisms determine what actions each role is allowed to perform. This is often implemented using RBAC. Vulnerabilities: Bypassing authorization checks, Accessing admin pages without proper credentials."
                                },
                                {
                                    heading: "Data Access Control",
                                    content: "Controlling who can view, modify, or delete data within the application. Examples: Viewing or editing other users' profiles, Accessing sensitive financial information, Modifying application settings. Vulnerabilities: Insecure Direct Object References (IDOR), SQL injection."
                                }
                            ]
                        },
                        {
                            title: "Operating Systems",
                            content: [
                                {
                                    heading: "File Permissions",
                                    content: "Controlling who can read, write, or execute files. File systems (e.g., NTFS, ext4) use permissions to control access to files and directories. Permissions typically define who can read, write, and execute a file. This is often implemented using DAC. Vulnerabilities: Incorrect permission settings, Privilege escalation exploits."
                                },
                                {
                                    heading: "User Accounts and Privileges",
                                    content: "Managing user accounts and assigning appropriate privileges. Operating systems manage user accounts and assign privileges to control what users can do. Privileges can include the ability to install software, modify system settings, or access specific resources. This is related to RBAC and the principle of least privilege. Vulnerabilities: Weak password policies, Privilege escalation exploits."
                                },
                                {
                                    heading: "System Calls and Process Access",
                                    content: "Controlling which processes can access system resources and perform specific operations. Operating systems control access to system resources through system calls. Access control mechanisms ensure that processes can only access the resources they need. This is related to Mandatory Access Control (MAC) in some systems. Vulnerabilities: Buffer overflows, Race conditions."
                                }
                            ]
                        },
                        {
                            title: "Databases",
                            content: [
                                {
                                    heading: "User Accounts and Roles",
                                    content: "Managing user accounts and assigning appropriate roles for database access. Databases use user accounts and roles to control who can access the database. Roles define sets of permissions that can be assigned to users. This is an example of RBAC. Vulnerabilities: Weak password policies, SQL injection."
                                },
                                {
                                    heading: "Table and Column Permissions",
                                    content: "Controlling which users or roles can access specific tables or columns within a database. Databases allow you to control access to specific tables and columns. This allows for fine-grained control over data access. This is related to fine-grained access control. Vulnerabilities: SQL injection, Insufficient permission checking."
                                },
                                {
                                    heading: "Data Manipulation Operations",
                                    content: "Controlling which users or roles can perform operations like SELECT, INSERT, UPDATE, and DELETE. Databases allow you to control who can perform data manipulation operations. This ensures data integrity and prevents unauthorized modifications. Vulnerabilities: SQL injection, Insufficient permission checking."
                                }
                            ]
                        },
                        {
                            title: "APIs (Application Programming Interfaces)",
                            content: [
                                {
                                    heading: "API Authentication",
                                    content: "Verifying the identity of applications or users accessing the API. APIs use authentication mechanisms to verify the identity of the client making the request. Common methods include API keys, OAuth 2.0, and JWTs. Vulnerabilities: Weak API keys, Missing authentication, Insecure OAuth implementations."
                                },
                                {
                                    heading: "API Authorization",
                                    content: "Controlling access to different API resources or functionalities based on the authenticated entity. APIs use authorization mechanisms to control what resources and functionalities the authenticated client can access. This ensures that clients only have access to the data and functions they are authorized to use. This is often implemented using RBAC or ABAC. Vulnerabilities: Missing authorization checks, IDOR, Privilege escalation."
                                },
                                {
                                    heading: "Data Filtering and Masking",
                                    content: "Restricting or obscuring sensitive data returned by the API. APIs may need to filter or mask sensitive data based on the client's permissions. This prevents unauthorized clients from accessing sensitive information. Vulnerabilities: Insufficient data filtering, Incorrect masking."
                                }
                            ]
                        },
                        {
                            title: "Cloud Computing",
                            content: [
                                {
                                    heading: "Identity and Access Management (IAM)",
                                    content: "Managing user identities and access privileges for cloud resources. Cloud providers (e.g., AWS, Azure, GCP) use IAM services to control access to cloud resources. IAM allows you to define policies that specify who can access which resources and what actions they can perform. Vulnerabilities: Overly permissive IAM policies, Misconfigured roles."
                                },
                                {
                                    heading: "Access Control for Storage Buckets",
                                    content: "Controlling who can access data stored in cloud storage services. Cloud storage services use access control mechanisms to control who can access data stored in buckets or containers. Permissions can be set at the bucket level or at the object level. Vulnerabilities: Publicly accessible buckets, Misconfigured bucket policies."
                                },
                                {
                                    heading: "Access Control for Virtual Machines",
                                    content: "Controlling who can access and manage virtual machines in the cloud. Cloud providers use access control mechanisms to control who can access and manage virtual machines. Access can be controlled through SSH keys, security groups, and IAM policies. Vulnerabilities: Weak SSH keys, Misconfigured security groups."
                                },
                                {
                                    heading: "Access Control for Other Cloud Services",
                                    content: "Controlling access to other cloud services like databases, message queues, and serverless functions. Cloud providers use access control mechanisms to control access to other cloud services. Each service may have its own specific access control mechanisms. Vulnerabilities: Service-specific misconfigurations, Overly permissive policies."
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            level: "Intermediate",
            topics: [
                {
                    title: "Access Control Models in Detail",
                    subtopics: [
                        {
                            title: "Discretionary Access Control (DAC)",
                            content: [
                                {
                                    heading: "Detailed Explanation",
                                    content: "DAC is a model where access to objects (files, resources, etc.) is determined by the owner of that object. The owner has the 'discretion' to grant or revoke access to other subjects (users, processes). Access is typically based on the identity of the user or the group to which the user belongs. DAC is very flexible but can be less secure in complex environments due to its reliance on individual users to make security decisions. It contrasts with MAC, where a central authority dictates access, and users cannot change those settings."
                                },
                                {
                                    heading: "Deeper Dive",
                                    content: "DAC is prevalent in many operating systems because it provides a simple and intuitive way for users to manage their files. However, its weakness lies in the fact that a user might unknowingly grant excessive permissions or fall victim to social engineering attacks (like Trojan horses) that exploit their permissions. DAC systems often involve Access Control Lists (ACLs), which are lists of permissions attached to each object specifying which subjects can perform which actions."
                                },
                                {
                                    heading: "Examples",
                                    content: "File permissions in Unix-like systems (e.g., chmod). chmod 755 file.txt: This command sets permissions for 'file.txt'. 7: Owner has read (4), write (2), and execute (1) permissions $(4+2+1=7)$. 5: Group has read (4) and execute (1) permissions $(4+1=5)$. 5: Others have read (4) and execute (1) permissions $(4+1=5)$. File permissions in Windows NTFS. NTFS uses Access Control Lists (ACLs) to manage permissions. ACLs are more fine-grained than Unix permissions. NTFS permissions include 'Full Control,' 'Modify,' 'Read & execute,' 'List folder contents,' 'Read,' and 'Write.' Permissions can be 'Allowed' or 'Denied.' 'Deny' permissions always take precedence."
                                },
                                {
                                    heading: "Deeper Dive for Examples",
                                    content: "chmod uses octal notation. Each digit represents permissions for user, group, and others, respectively. The chown command is also related to DAC, as it allows changing the owner of a file, thus changing who has the primary control over its permissions. Unix-like systems also have the concept of 'setuid' and 'setgid' bits, which can temporarily elevate the privileges of a process to that of the file's owner or group, respectively. These are important for understanding potential vulnerabilities. NTFS ACLs are composed of Access Control Entries (ACEs). Each ACE specifies a trustee (user or group), the access rights, and inheritance flags (how permissions propagate to subfolders). NTFS supports permission inheritance, where permissions set on a folder are automatically applied to files and subfolders within it. The 'Effective Permissions' tab in Windows file properties is crucial for troubleshooting complex NTFS permission scenarios."
                                },
                                {
                                    heading: "Strengths",
                                    content: "Simple to implement and understand for basic access control. It aligns well with how users intuitively think about file ownership. Provides flexibility to resource owners. Users can easily grant access to others as needed. Users have fine-grained control over their own resources. This allows for granular control in smaller, less complex systems."
                                },
                                {
                                    heading: "Weaknesses",
                                    content: "Vulnerable to Trojan horse attacks. If a user is tricked into running a malicious program (Trojan horse), that program runs with the user's permissions. It can then access or modify any file the user can, potentially leading to significant damage. Lack of centralized control. In large systems, enforcing consistent security policies can be very difficult. Users might set permissions incorrectly or inconsistently. Difficult to enforce consistent security policies. Because access control is distributed among individual owners, it's hard to ensure that everyone adheres to a uniform security standard. This can lead to security gaps and inconsistencies."
                                },
                                {
                                    heading: "Deeper Dive for Weaknesses",
                                    content: "This is a fundamental limitation of DAC. The system grants access based on the identity of the user running the process, not the process's integrity or intent. Sandboxing and process isolation techniques are often used to mitigate this risk, but they are not inherent to the DAC model itself."
                                }
                            ]
                        },
                        {
                            title: "Mandatory Access Control (MAC)",
                            content: [
                                {
                                    heading: "Detailed Explanation",
                                    content: "MAC is a model where a central authority (the operating system or a security administrator) determines access. Users cannot change these settings. Access is based on security labels assigned to both subjects (users, processes) and objects (files, resources). Subjects are assigned a security clearance level, and objects are assigned a sensitivity level or classification. The system compares these labels to determine if access is allowed. MAC is often used in high-security environments like military or government systems."
                                },
                                {
                                    heading: "Deeper Dive",
                                    content: "MAC enforces strict information flow policies. A common example is the BellLaPadula model (for confidentiality) and the Biba model (for integrity). MAC implementations often involve a Security Kernel, which is a core part of the operating system responsible for enforcing access control. MAC systems can be complex to configure and manage but provide a very high level of security."
                                },
                                {
                                    heading: "Examples",
                                    content: "Military security classification (e.g., Top Secret, Secret, Confidential). A user with a 'Secret' clearance cannot access a document classified as 'Top Secret'. SELinux (Security-Enhanced Linux). SELinux is a Linux security module that implements MAC. It uses security labels (security contexts) to control access. Processes are confined to domains."
                                },
                                {
                                    heading: "Deeper Dive for Examples",
                                    content: "These classifications are hierarchical. A user with 'Top Secret' clearance can access 'Secret,' 'Confidential,' and 'Unclassified' documents, but not vice versa. MAC systems often implement the 'need-to-know' principle, further restricting access even within the same clearance level. SELinux labels every process, file, directory, socket, etc., with a security context. Security policies define how these contexts can interact. For example, a web server process might be confined to a domain that prevents it from accessing database files directly. SELinux is very powerful but can be complex to configure. It significantly enhances system security by limiting the damage a compromised process can cause."
                                },
                                {
                                    heading: "Strengths",
                                    content: "Highly secure. Enforces very strict access control policies. Provides centralized control. Security administrators have full control over access permissions. Reduces the risk of insider threats. Users cannot easily bypass security mechanisms."
                                },
                                {
                                    heading: "Weaknesses",
                                    content: "Less flexible than DAC. Users have little or no control over their own access permissions. Complex to implement and manage. Requires specialized knowledge to configure and maintain. Can be difficult for users to understand and use. The strict rules can sometimes hinder productivity."
                                }
                            ]
                        },
                        {
                            title: "Role-Based Access Control (RBAC)",
                            content: [
                                {
                                    heading: "Detailed Explanation",
                                    content: "RBAC is a model where access is based on a user's role within an organization. Permissions are associated with roles, and users are assigned to those roles. This simplifies access management, especially in large organizations, as you manage permissions at the role level rather than at the individual user level. RBAC is widely used in enterprise applications."
                                },
                                {
                                    heading: "Deeper Dive",
                                    content: "RBAC can be hierarchical. Roles can inherit permissions from other roles. RBAC systems often involve role activation/deactivation, where users can activate only the roles they need at a given time. RBAC helps enforce the principle of least privilege and separation of duties."
                                },
                                {
                                    heading: "Examples",
                                    content: "Employees in the 'Sales' department have access to sales records. A 'Sales Representative' role might have permissions to: View customer data. Create orders. A 'Sales Manager' role might have permissions to: View sales reports. Manage sales representatives. Users with the 'Administrator' role have access to all system functions. An 'Administrator' role would have permissions to: Create user accounts. Modify system settings. Manage security policies."
                                },
                                {
                                    heading: "Strengths",
                                    content: "Easy to manage in organizations with many users. Adding or removing users is simplified by assigning them to roles. Provides a clear and consistent way to manage access. Roles provide a standardized way to define permissions. Reduces administrative overhead. Changes to permissions only need to be made at the role level. Improves security by enforcing consistent access control."
                                },
                                {
                                    heading: "Weaknesses",
                                    content: "Can become complex in highly dynamic environments. If roles and permissions change frequently, RBAC management can become challenging. May not be suitable for situations requiring fine-grained control. RBAC might not be sufficient if access needs to be controlled at a very granular level (e.g., specific data fields)."
                                }
                            ]
                        },
                        {
                            title: "Attribute-Based Access Control (ABAC)",
                            content: [
                                {
                                    heading: "Detailed Explanation",
                                    content: "ABAC is the most flexible and powerful model. Access is based on attributes of the user, the resource, and the environment. Attributes are characteristics or properties. Access control decisions are made by evaluating policies that combine these attributes. ABAC is very dynamic and context-aware."
                                },
                                {
                                    heading: "Deeper Dive",
                                    content: "ABAC allows for very fine-grained and complex access control. Policies are often expressed in a rule-based language (e.g., XACML - eXtensible Access Control Markup Language). ABAC is well-suited for modern, distributed systems where access control needs to adapt to changing conditions."
                                },
                                {
                                    heading: "Examples",
                                    content: "Allowing access to a file only if the user is in the finance department AND accessing it during business hours. User attributes: 'finance department'. Environment attributes: 'business hours'. Granting access to a web page based on the user's IP address and the time of day. User attributes: 'IP address'. Environment attributes: 'time of day'."
                                },
                                {
                                    heading: "Strengths",
                                    content: "Most flexible and powerful access control model. Can handle very complex scenarios. Allows for fine-grained control. Access can be controlled at the level of individual data fields or resources. Can adapt to complex and dynamic environments. Policies can be easily modified to reflect changing business needs. Enables context-aware access control. Access can be granted or denied based on the context of the request."
                                },
                                {
                                    heading: "Weaknesses",
                                    content: "Complex to implement and manage. Requires careful planning and sophisticated policy management tools. Requires careful planning and design. Defining and maintaining attributes and policies can be challenging. Policy management can become challenging with a large number of attributes."
                                }
                            ]
                        }
                    ]
                },
                {
                    title: "Common Broken Access Control Vulnerabilities",
                    subtopics: [
                        {
                            title: "Missing Function-Level Access Control",
                            content: [
                                {
                                    heading: "Detailed Explanation",
                                    content: "Function-level access control is about restricting access to specific functions or actions that an application performs. These functions are often accessed via URLs, API endpoints, or form submissions. If an application fails to properly verify if a user is authorized to access a function before executing it, this vulnerability arises. It's crucial to perform these checks on the server-side, as client-side checks can be easily bypassed."
                                },
                                {
                                    heading: "Deeper Dive",
                                    content: "This vulnerability often stems from a 'security by obscurity' approach, where developers assume that hiding links or UI elements is sufficient to prevent access. Attackers can use various techniques to discover and access these hidden functions. Modern web frameworks and API design patterns can help or hinder the implementation of proper function-level access control."
                                },
                                {
                                    heading: "Attack Vectors",
                                    content: "Direct URL Access: Attackers can directly type or manipulate URLs in the browser's address bar to access administrative or restricted functions. Example: Accessing example.com/admin/delete_user without being logged in as an administrator. Attackers might guess or discover these URLs through techniques like: Directory Bruteforcing: Using automated tools (e.g., DirBuster, ffuf) to try common directory and file names. Web Crawling: Using web crawlers or manually inspecting HTML/JavaScript to find hidden links or API endpoints. Information Disclosure: Finding URLs in documentation, error messages, or comments in the code. API Call Manipulation: Attackers can modify API requests to access unauthorized functions or data. This is particularly relevant for REST APIs. Example: Modifying the request body or headers to bypass authorization checks. Attackers might: Change HTTP methods: Switching from GET to POST, PUT, or DELETE if the server doesn't properly restrict allowed methods. Add or modify parameters: Including or changing parameters in the request to access different resources or trigger different actions. Forge authentication headers: Manipulating headers related to authentication (e.g., Authorization) if the API uses weak authentication schemes."
                                },
                                {
                                    heading: "Impact",
                                    content: "Unauthorized access to sensitive functions. Attackers can perform actions they are not supposed to. Performing actions that should be restricted to administrators or other privileged users. This can lead to data breaches, system compromise, and other serious consequences."
                                },
                                {
                                    heading: "Prevention",
                                    content: "Centralized Authorization Checks: Implement authorization logic in a central place within the application. This ensures consistency and reduces the risk of overlooking checks. Use a dedicated authorization module or library. Many frameworks provide built-in or third-party libraries for handling authorization. Role-Based Access Control (RBAC): Use RBAC to define and manage permissions for different roles. Clearly define roles and their associated permissions. Assign users to roles and enforce permissions based on these roles. Attribute-Based Access Control (ABAC): Use ABAC for more complex authorization requirements, where access depends on various attributes. Define rules based on user attributes, resource attributes, and environmental conditions. Secure by Default: Adopt a 'deny by default' approach. This means that access to any function should be denied unless explicitly allowed by an authorization rule. This is a crucial security principle to prevent accidental exposure of functionality."
                                }
                            ]
                        },
                        {
                            title: "Metadata Manipulation",
                            content: [
                                {
                                    heading: "Detailed Explanation",
                                    content: "Metadata is 'data about data.' It provides context and information about a resource. Examples include file metadata (e.g., file type, size, creation date), HTTP headers, and data stored in hidden form fields. This vulnerability occurs when an application relies on metadata for access control decisions without properly validating it. Attackers can manipulate metadata to trick the application into granting unauthorized access."
                                },
                                {
                                    heading: "Deeper Dive",
                                    content: "Metadata manipulation attacks exploit the trust an application places in the integrity of metadata. It's essential to treat all metadata as untrusted input, even if it comes from seemingly reliable sources."
                                },
                                {
                                    heading: "Attack Vectors",
                                    content: "Hidden Form Field Manipulation: Web pages often use hidden form fields to store data that is not directly visible to the user. Attackers can use browser developer tools (e.g., Inspect Element) to view and modify the values of these hidden fields. Example: Changing a hidden field that stores a user's role or privilege level. HTTP Header Manipulation: HTTP headers provide metadata about the request and response. Attackers can use tools like Burp Suite or Postman to intercept and modify HTTP headers. Example: Changing the Content-Type header to bypass file type validation or the X-Forwarded-For header to spoof their IP address. File Metadata Manipulation: Files often contain embedded metadata (e.g., EXIF data in images). Attackers can modify this metadata to bypass validation checks or inject malicious content. Example: Modifying the dimensions in an image's EXIF data to bypass size restrictions on uploads."
                                },
                                {
                                    heading: "Impact",
                                    content: "Bypassing access control checks. Attackers can gain access to resources or functions they are not authorized to use. Gaining unauthorized access to data or functions. Performing malicious actions. This can include data theft, account takeover, or code execution."
                                },
                                {
                                    heading: "Prevention",
                                    content: "Strict Metadata Validation: Validate all metadata received from users or external sources. Use data types, range checks, regular expressions, and whitelists to ensure metadata conforms to expected values. Sanitization and Encoding: Sanitize metadata to remove or neutralize any potentially harmful characters or sequences. Encode metadata properly before using it in any security-sensitive context. This prevents attackers from injecting code or escaping. Treat Metadata as Untrusted Input: Minimize Metadata Exposure."
                                }
                            ]
                        },
                        {
                            title: "CORS Misconfigurations",
                            content: [
                                {
                                    heading: "Detailed Explanation",
                                    content: "Cross-Origin Resource Sharing (CORS) is a mechanism that uses HTTP headers to allow web pages from one origin (domain) to access resources from a different origin. The same-origin policy is a fundamental security mechanism implemented by web browsers. It restricts how a document or script loaded from one origin can interact with a resource from another origin. An origin is defined by the combination of the protocol (e.g., HTTP, HTTPS), hostname (e.g., example.com), and port (e.g., 80, 443). CORS provides a way to relax the same-origin policy in a controlled manner, allowing legitimate cross-origin requests while still protecting against malicious ones. CORS works by adding new HTTP headers that give browsers permission to access selected resources from a different origin."
                                },
                                {
                                    heading: "Deeper Dive",
                                    content: "CORS is a complex mechanism with various headers and preflight requests. The Access-Control-Allow-Origin header is the most important, but others like Access-Control-Allow-Methods, Access-Control-Allow-Headers, and Access-Control-Allow-Credentials are also critical. Preflight requests (using the OPTIONS method) are used by browsers to determine if a cross-origin request is safe to send. CORS is often a source of confusion for developers, leading to misconfigurations."
                                },
                                {
                                    heading: "Attack Vectors",
                                    content: "Wildcard Origin: Allowing access from any origin (Access-Control-Allow-Origin: *). This effectively disables the same-origin policy for the resource, allowing any website to make requests to it. This is a major security risk. Null Origin: Allowing access from requests with a null origin (Access-Control-Allow-Origin: null). A 'null' origin can occur in specific scenarios, such as when a page is loaded from a file:// URL or from within a sandboxed iframe. Untrusted Origin: Allowing access from specific origins that are not sufficiently trusted. Even if you don't use a wildcard, allowing access from a list of origins can be risky if one of those origins is compromised. Attackers can then use the compromised origin as a proxy to attack your server. Misconfigured Methods or Headers: Improperly restricting the allowed HTTP methods or headers in CORS requests. Access-Control-Allow-Methods: Should only include the HTTP methods that are actually needed (e.g., GET, POST, PUT, DELETE). Allowing unnecessary methods can open up attack vectors. Access-Control-Allow-Headers: Should restrict the allowed HTTP headers to only those that are required. Allowing arbitrary headers can create vulnerabilities."
                                },
                                {
                                    heading: "Deeper Dive for Attack Vectors",
                                    content: "Using the wildcard origin $(*)$ is almost always a bad practice. It opens up the server to a wide range of attacks, including those from malicious websites that users might visit. It makes it very difficult to control who can access your resources. The security implications of allowing the null origin can be subtle. It's important to understand the specific contexts in which null origin requests can arise and whether they pose a risk to your application. It's crucial to carefully vet any origins that you allow access. Consider the security posture of those origins and whether they have a history of vulnerabilities. For example, if an API endpoint is only intended to be accessed with GET and POST requests, the Access-Control-Allow-Methods header should not include PUT or DELETE. Similarly, if your API only needs specific headers, don't allow arbitrary ones. Attackers might try to inject malicious headers to bypass security checks."
                                },
                                {
                                    heading: "Impact",
                                    content: "Unauthorized access to sensitive data: Attackers can use JavaScript in a malicious website to make cross-origin requests to the vulnerable server and access data that would normally be protected by the same-origin policy. Cross-Site Scripting (XSS) attacks: CORS misconfigurations can sometimes be exploited in conjunction with XSS to steal user credentials or perform other malicious actions. Cross-Site Request Forgery (CSRF) attacks: In some cases, CORS vulnerabilities can make it easier for attackers to perform CSRF attacks."
                                },
                                {
                                    heading: "Prevention",
                                    content: "Restrict Origins: Specify explicit and trusted origins in the Access-Control-Allow-Origin header. Instead of using the wildcard (*), provide a list of the exact domains that are permitted to access the resource. This is the most important step in preventing CORS-related vulnerabilities. Validate Methods and Headers: Properly restrict the allowed HTTP methods and headers using the Access-Control-Allow-Methods and Access-Control-Allow-Headers headers. Only allow the specific HTTP methods and headers that are actually needed by your application. Be as restrictive as possible to minimize the attack surface. Avoid Wildcards: Avoid using the wildcard origin $(*)$ whenever possible. It is generally considered a bad practice and should only be used in very specific circumstances where the resource is truly public and accessible to everyone. Properly Configure Credentials: Use the Access-Control-Allow-Credentials header with caution and only when necessary. This header is used to indicate whether cross-origin requests can include authentication credentials (e.g., cookies, HTTP authentication). If you use Access-Control-Allow-Credentials: true, you cannot use the wildcard origin (*) in the Access-Control-Allow-Origin header. You must specify explicit origins."
                                },
                                {
                                    heading: "Deeper Dive for Prevention",
                                    content: "If possible, avoid using subdomains in the Access-Control-Allow-Origin header (e.g., prefer example.com over *.example.com). Wildcarding subdomains can introduce risks. Regularly review and update the list of allowed origins. Carefully consider the purpose of each API endpoint and which methods and headers are truly necessary. Follow the principle of least privilege: only allow what is strictly required. Even in situations where you think the resource is public, carefully consider the security implications of using the wildcard. There might be better ways to achieve the desired functionality without compromising security. Allowing credentials in cross-origin requests increases the risk of CSRF attacks. Only enable this if your application absolutely needs it and you have other strong CSRF protection mechanisms in place."
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            level: "Advanced",
            topics: [
                {
                    title: "Advanced Access Control Concepts",
                    subtopics: [
                        {
                            title: "Context-Aware Access Control (CAC)",
                            content: [
                                {
                                    heading: "Detailed Explanation",
                                    content: "CAC is an access control model that goes beyond traditional authentication and authorization by incorporating contextual information into access control decisions. It considers various factors related to the user, the resource, and the environment to make more dynamic and granular access control decisions. CAC aims to enhance security by adapting access permissions based on the current situation, reducing the risk of unauthorized access even if credentials are compromised."
                                },
                                {
                                    heading: "Deeper Dive",
                                    content: "CAC often involves the use of policy engines that evaluate complex rules based on a combination of contextual attributes. It can be implemented using Attribute-Based Access Control (ABAC) as a foundation, extending ABAC with context-aware policies. CAC is particularly useful in scenarios where security requirements vary significantly depending on the context, such as mobile access, cloud computing, and IoT environments."
                                },
                                {
                                    heading: "Contextual Information",
                                    content: "Time of day: Access might be allowed only during business hours to reduce the risk of unauthorized access outside of work hours. User location: Access might be restricted based on the user's IP address, geographical location (using GPS or geolocation services), or network location (e.g., internal network vs. public Wi-Fi). Device used: Access might be granted or denied based on the type of device (e.g., mobile, desktop, company-owned vs. personal). Network conditions: Access might be restricted based on the network connection (e.g., internal network vs. public Wi-Fi, connection speed, or security of the network). User behavior: Access might be adjusted based on the user's typical usage patterns (e.g., login frequency, access patterns, or unusual activity)."
                                },
                                {
                                    heading: "Deeper Dive for Time of Day",
                                    content: "This can be crucial for protecting sensitive data that should only be accessed by employees during their work shifts. It can also help in detecting anomalies, as access attempts outside of normal hours might indicate suspicious activity."
                                },
                                {
                                    heading: "Deeper Dive for User Location",
                                    content: "This is important for preventing access from untrusted locations or for enforcing compliance with regulations that restrict data access based on location. For example, a company might restrict access to sensitive financial data to users within the company's headquarters."
                                },
                                {
                                    heading: "Deeper Dive for Device Used",
                                    content: "This allows organizations to enforce security policies based on the security posture of the device. For example, access to sensitive data might be restricted to company-owned devices that are managed and have up-to-date security software."
                                },
                                {
                                    heading: "Deeper Dive for Network Conditions",
                                    content: "This can help prevent access over insecure networks, such as public Wi-Fi, where data transmission can be intercepted. It can also be used to prioritize access for users on high-bandwidth, reliable connections."
                                },
                                {
                                    heading: "Deeper Dive for User Behavior",
                                    content: "This allows for the detection of anomalous behavior that might indicate a compromised account. For example, if a user typically logs in from a specific location and then suddenly logs in from a different country, the system might require additional authentication or restrict access."
                                },
                                {
                                    heading: "Example",
                                    content: "Allowing access to sensitive data only during business hours and from within the company network. User attributes: User's role (e.g., 'Finance Clerk'), department (e.g., 'Finance'). Environment attributes: Time of day (e.g., 9:00 AM to 5:00 PM), network location (e.g., IP address range of the company network). Policy: Access is granted if user's role is 'Finance Clerk' AND user's department is 'Finance' AND time is within business hours AND network location is within the company. Requiring multi-factor authentication (MFA) when a user logs in from an unfamiliar location. User attributes: User's login history, location history. Environment attributes: User's current location (e.g., IP address, geolocation). Policy: If user's current location is significantly different from their usual login locations, require MFA. Restricting access to certain functionalities based on the user's role and the time of day. User attributes: User's role (e.g., 'Intern', 'Employee', 'Manager'). Environment attributes: Time of day. Policy: Interns can only access basic functionalities, Employees can access more, and Managers have full access, but only during business hours."
                                },
                                {
                                    heading: "Implementation Considerations",
                                    content: "Collecting and managing context data: This involves integrating with various systems and sensors to gather the necessary contextual information. Data sources might include: Directory services (e.g., Active Directory, LDAP) for user attributes. Geolocation services (e.g., GPS, IP geolocation) for user location. Device management systems (e.g., MDM) for device information. Network monitoring tools for network conditions. User activity logs for user behavior. Data must be collected, stored, and processed securely and in compliance with privacy regulations. Defining and enforcing complex access control rules: CAC policies can be significantly more complex than traditional access control policies. Policy management systems are needed to define, store, and enforce these complex rules. Policy languages (e.g., XACML - eXtensible Access Control Markup Language) can be used to express CAC policies. These policy languages allow for the creation of very granular and flexible rules. Performance considerations for real-time context analysis: CAC decisions need to be made in real-time to avoid disrupting user experience. This can be challenging when dealing with large amounts of context data and complex policies. Optimization techniques are crucial, such as: Caching frequently used context data. Indexing attributes for faster policy evaluation. Using efficient policy evaluation algorithms."
                                }
                            ]
                        },
                        {
                            title: "Delegation and OAuth 2.0",
                            content: [
                                {
                                    heading: "Detailed Explanation",
                                    content: "OAuth 2.0 is an authorization framework that enables third-party applications to obtain limited access to user resources on a service without requiring the user to share their credentials (e.g., username and password). It allows for delegated authorization, where a user grants permission to an application to act on their behalf. OAuth 2.0 is widely used for securing APIs and enabling integrations between different services."
                                },
                                {
                                    heading: "Deeper Dive",
                                    content: "OAuth 2.0 is based on the concept of access tokens, which are credentials that an application uses to access protected resources. It defines several grant types, which are different ways for an application to obtain an access token. OAuth 2.0 relies on HTTPS for secure communication and involves a series of steps to authenticate the user, authorize the application, and issue the access token."
                                },
                                {
                                    heading: "Security Considerations",
                                    content: "Properly validating redirect URIs: The redirect URI is the URL to which the user is redirected after granting or denying permission to the application. It's crucial to validate the redirect URI to prevent attackers from intercepting the authorization code or access token. Servers must strictly enforce a whitelist of allowed redirect URIs. Preventing authorization code theft: The authorization code is a temporary credential that is exchanged for an access token. It's important to protect the authorization code from being intercepted or stolen by attackers. Authorization codes should be short-lived and transmitted over HTTPS. Securing access tokens: Access tokens are credentials that applications use to access protected resources on behalf of the user. They should be treated as sensitive information and protected from leakage or theft. Access tokens should be strong, unpredictable, and stored securely. Token Expiration: Access tokens should have a limited lifespan to reduce the impact of token theft. Refresh tokens can be used to obtain new access tokens without requiring the user to re-authorize the application. Refresh tokens should also be protected and stored securely. Scope Management: Scopes define the specific permissions that an access token grants to an application. Applications should only request the minimum necessary scopes to perform their functions. Servers should carefully validate and enforce scopes to prevent applications from accessing resources they are not authorized to use."
                                },
                                {
                                    heading: "Deeper Dive for Redirect URIs",
                                    content: "Attackers might try to manipulate the redirect URI to redirect the user to a malicious website that looks like the legitimate authorization server. This is a common attack vector in OAuth 2.0, so proper validation is essential."
                                },
                                {
                                    heading: "Deeper Dive for Authorization Code Theft",
                                    content: "Attackers might try to steal the authorization code by intercepting the redirect from the authorization server to the client application. This can be done through man-in-the-middle attacks or by exploiting vulnerabilities in the client application."
                                },
                                {
                                    heading: "Deeper Dive for Securing Access Tokens",
                                    content: "Access tokens should be generated using cryptographically secure random number generators. They should be transmitted over HTTPS and stored securely on the client-side (e.g., in secure storage or encrypted). Avoid logging access tokens, as this can expose them to attackers."
                                },
                                {
                                    heading: "Deeper Dive for Token Expiration",
                                    content: "Short-lived access tokens limit the window of opportunity for an attacker if a token is compromised. Refresh tokens should have a longer lifespan but should still be subject to security best practices."
                                },
                                {
                                    heading: "Deeper Dive for Scope Management",
                                    content: "For example, an application that only needs to read a user's profile information should not request permission to access their contacts or messages. Proper scope management is crucial for implementing the principle of least privilege in OAuth 2.0."
                                }
                            ]
                        },
                        {
                            title: "Access Control in Microservices",
                            content: [
                                {
                                    heading: "Detailed Explanation",
                                    content: "Microservices architecture presents unique access control challenges due to its distributed nature. Applications are composed of small, independent services that communicate with each other over a network. Access control must be enforced at the service level to ensure that only authorized services can communicate with each other and access each other's data."
                                },
                                {
                                    heading: "Deeper Dive",
                                    content: "Traditional access control mechanisms might not be suitable for microservices, as they often rely on centralized authentication and authorization servers. Microservices require more distributed and decentralized access control solutions that can handle the dynamic and scalable nature of the architecture."
                                },
                                {
                                    heading: "Techniques",
                                    content: "Mutual TLS (mTLS): mTLS is a security mechanism that requires both the client and the server to authenticate each other using digital certificates. This ensures that both the service making the request and the service receiving the request are who they claim to be. mTLS is often used to secure communication between microservices. API Gateways: An API gateway is a component that sits in front of the microservices and handles external requests. The gateway can perform authentication and authorization checks for external requests, protecting the underlying microservices. This can simplify access control and provide a single point of enforcement. Service Meshes: A service mesh is a dedicated infrastructure layer that handles service-to-service communication. Service meshes can provide features like authentication, authorization, and encryption for service-to-service communication. They can simplify security and improve the reliability and observability of microservices communication. JWT Propagation: JSON Web Tokens (JWTs) can be used to propagate user identity and authorization context between microservices. When a user authenticates with the system, a JWT is issued. This JWT is then passed along with requests to other microservices, allowing them to verify the identity and permissions of the user."
                                },
                                {
                                    heading: "Deeper Dive for mTLS",
                                    content: "mTLS provides strong authentication and encryption, preventing man-in-the-middle attacks and ensuring data confidentiality and integrity. It requires careful management of certificates and can add complexity to the deployment and configuration of microservices."
                                },
                                {
                                    heading: "Deeper Dive for API Gateways",
                                    content: "API gateways can also provide other functionalities, such as request routing, rate limiting, and caching. They can help to decouple the client applications from the internal structure of the microservices architecture."
                                },
                                {
                                    heading: "Deeper Dive for Service Meshes",
                                    content: "Service meshes typically use a sidecar proxy pattern, where a proxy is deployed alongside each microservice to handle communication. They can provide fine-grained control over traffic flow and security policies."
                                },
                                {
                                    heading: "Deeper Dive for JWT Propagation",
                                    content: "JWTs are a standard way of representing claims securely. They can be digitally signed to ensure their integrity. JWT propagation can help to avoid the need for each microservice to authenticate the user independently."
                                }
                            ]
                        },
                        {
                            title: "Fine-Grained Access Control",
                            content: [
                                {
                                    heading: "Detailed Explanation",
                                    content: "Fine-grained access control is the ability to control access to specific data fields, records, or resources, rather than granting or denying access to an entire object. It allows for very granular control over who can access what information, which is crucial for protecting sensitive data and complying with privacy regulations. Fine-grained access control is often implemented using Attribute-Based Access Control (ABAC) or extensions to Role-Based Access Control (RBAC)."
                                },
                                {
                                    heading: "Deeper Dive",
                                    content: "Fine-grained access control can be complex to implement, as it requires careful design of data structures, access control policies, and enforcement mechanisms. It can also have performance implications, as checking fine-grained permissions might require more complex computations."
                                },
                                {
                                    heading: "Example",
                                    content: "Allowing a user to view a customer record but not their credit card number. Access control policy would specify that users with the 'Customer Support' role can view general customer information, but only users with the 'Finance' role can access financial details like credit card numbers. Granting access to specific columns in a database table. Database systems can be configured to grant SELECT permissions on specific columns, so a user might be able to see a customer's name and address but not their social security number. Controlling access to individual fields in a JSON object. APIs can be designed to filter or mask certain fields in the JSON response based on the user's permissions, so a mobile app might receive a user profile without the email address if the user doesn't have the necessary authorization."
                                },
                                {
                                    heading: "Implementation Techniques",
                                    content: "Attribute-Based Access Control (ABAC): ABAC is well-suited for fine-grained access control as it allows you to define rules based on attributes of the user, resource, and environment. For example, you could create a rule that says 'Only users in the \"HR\" department can view salary information for employees in their department.' ABAC provides the flexibility to express very granular and context-aware access control policies. Role-Based Access Control (RBAC) with Data-Level Permissions: RBAC can be extended to include data-level permissions, allowing you to control access to specific data records or fields based on the user's role. This might involve storing additional permissions at the data level or using database views or filters to restrict access. For example, you could assign a 'Manager' role that has general access to employee data, but also have specific data-level permissions that allow managers to only view the salary information of employees in their own team. Data Filtering and Masking: Data filtering involves removing data that the user is not authorized to see. Data masking involves obscuring sensitive data while still providing access to other information. For example, you might filter out a customer's social security number from a search result or mask a credit card number, showing only the last four digits."
                                }
                            ]
                        }
                    ]
                },
                {
                    title: "Access Control in Cloud Environments (AWS Focus)",
                    subtopics: [
                        {
                            title: "AWS Identity and Access Management (IAM) Deep Dive",
                            content: [
                                {
                                    heading: "IAM Policies in Depth",
                                    content: "Policy structure and syntax: IAM policies are written in JSON (JavaScript Object Notation) and define permissions in AWS. Key elements of an IAM policy: Version: Specifies the version of the policy language. Statement: A JSON array of one or more individual statements. Each statement defines a set of permissions. Effect: Specifies whether the statement allows or denies access. Can be 'Allow' or 'Deny'. 'Deny' always overrides 'Allow'. Action: Specifies the AWS actions that are allowed or denied. Actions are service-specific (e.g., s3:GetObject for reading an object from S3, ec2:RunInstances for launching an EC2 instance). Resource: Specifies the AWS resources that the policy applies to. Resources are identified by Amazon Resource Names (ARNs). Condition (Optional): Specifies conditions that must be met for the policy to apply."
                                },
                                {
                                    heading: "Example",
                                    content: "This policy allows the s3:GetObject action:\n\nJSON\n{\n    \"Version\": \"2012-10-17\",\n    \"Statement\": \n    [\n        {\n            \"Effect\": \"Allow\",\n            \"Action\": \"s3:GetObject\",\n            \"Resource\": \"arn:aws:s3:::my-bucket/\\*\",\n            \"Condition\": {\n                \"IpAddress\": {\n                    \"aws:SourceIp\": \"192.168.1.0/24\"\n                }\n            }\n        }\n    ]\n}"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};

// Export schemas and sample module
module.exports = { courseSchema, moduleSchema, levelSchema, topicSchema, subtopicSchema, contentSchema, sampleModule };