import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Challenge } from '../models/Challenge.js';
import { Achievement } from '../models/Achievement.js';
import { GameSession } from '../models/GameSession.js';
import { DIRECT_MONGO_ADMIN_DOCUMENT } from '../config/adminDocument.js';

export const seedDatabase = async () => {
  try {
    // 1. Admin credentials must be given directly in MongoDB documents
    let existingAdmin = await User.findOne({ email: 'admin@gmail.com' });
    if (!existingAdmin) {
      const oldAdmin = await User.findOne({ email: 'admin@example.com' });
      if (oldAdmin) {
        const adminSalt = await bcrypt.genSalt(10);
        const adminHash = await bcrypt.hash('admin@123', adminSalt);
        await User.findByIdAndUpdate(oldAdmin._id, {
          email: 'admin@gmail.com',
          password: adminHash,
          role: 'admin'
        });
        console.log('✅ Updated existing administrator document to admin@gmail.com in MongoDB.');
      } else {
        console.log('🌱 Administrator document not found in MongoDB. Provisioning admin directly into MongoDB documents...');
        const adminSalt = await bcrypt.genSalt(10);
        const adminHash = await bcrypt.hash('admin@123', adminSalt);
        await User.create({
          ...DIRECT_MONGO_ADMIN_DOCUMENT,
          email: 'admin@gmail.com',
          password: adminHash,
          role: 'admin'
        });
        console.log('✅ Administrator credentials document directly inserted into MongoDB (admin@gmail.com).');
      }
    }

    // 2. Demo cadet account
    const existingDemo = await User.findOne({ email: 'demo@example.com' });
    if (!existingDemo) {
      const userSalt = await bcrypt.genSalt(10);
      const userHash = await bcrypt.hash('demo123', userSalt);
      await User.create({
        name: 'Alex CyberCadet',
        email: 'demo@example.com',
        password: userHash,
        role: 'user',
        gamesPlayed: 4,
        gamesCompleted: 3,
        bestScore: 80,
        averageScore: 72,
        accuracy: 78,
        badges: ['CYBER SMART'],
        achievements: ['PHISHING_HUNTER', 'PASSWORD_GUARDIAN']
      });
      console.log('✅ Demo player cadet account seeded.');
    }

    const challengeCount = await Challenge.countDocuments();
    if (challengeCount === 0) {
      console.log('🌱 Seeding cybersecurity challenges...');
      const challenges = [
        // ==========================================
        // 1. PHISHING CHALLENGES (6 challenges)
        // ==========================================
        {
          title: 'Suspicious Urgent Bank Security Notice',
          category: 'PHISHING',
          difficulty: 'EASY',
          points: 10,
          active: true,
          scenario: `From: Security Team <security-alert@chase-secure-verify.net>
Subject: 🚨 URGENT: Unauthorized login detected on your savings account!
Content: "Dear Customer, We detected an irregular login from Russia at 03:14 AM. Your debit card and funds will be permanently frozen within 15 minutes unless you immediately verify your credentials at: http://chase-secure-verify.net/auth/login"`,
          question: 'What is the safest action to take with this email?',
          options: [
            'Click the link quickly to verify your account before the 15-minute freeze',
            'Mark email as Phishing and visit your bank directly via the official mobile app or bookmarked URL',
            'Reply with your account number asking for confirmation',
            'Forward the email to friends to warn them about the freeze'
          ],
          correctAnswer: 'Mark email as Phishing and visit your bank directly via the official mobile app or bookmarked URL',
          explanation: 'The sender domain (@chase-secure-verify.net) is not the legitimate bank domain (chase.com). The artificial urgency ("15 minutes freeze") and direct external login link are classic indicators of a credential-harvesting phishing attack.',
          warningSigns: [
            'Forged external domain (@chase-secure-verify.net instead of chase.com)',
            'Manufactured panic and urgency (15 minutes deadline)',
            'Threat of account freeze if credentials are not entered immediately'
          ]
        },
        {
          title: 'College Internship Offer with DocuSign Attachment',
          category: 'PHISHING',
          difficulty: 'MEDIUM',
          points: 20,
          active: true,
          scenario: `From: Dean Career Office <career-portal@university-jobs-careers.co>
Subject: Offer Letter: Paid Summer Research Fellow ($45/hr)
Content: "Congratulations! You have been accepted for the Cyber Research Fellowship. Please download and open the attached 'Offer_Letter.pdf.exe' and enable macros to review your stipend contract."`,
          question: 'Is this document safe to download and execute?',
          options: [
            'Phishing / Malware: The double extension (.pdf.exe) and macro prompt indicates an executable payload',
            'Safe: Universities regularly use third-party portals to send contracts',
            'Safe: If you run it inside an incognito tab it cannot infect your computer',
            'Safe: The Dean office frequently recruits students directly via email'
          ],
          correctAnswer: 'Phishing / Malware: The double extension (.pdf.exe) and macro prompt indicates an executable payload',
          explanation: 'The attachment uses a disguised double extension (.pdf.exe) to trick users into running executable code disguised as a document. Real offer letters never require enabling macros or running .exe files.',
          warningSigns: [
            'Disguised file extension (.pdf.exe)',
            'Prompt requesting macro execution or binary launch',
            'Spoofed university domain (@university-jobs-careers.co)'
          ]
        },
        {
          title: 'Social Media Blue Badge Verification Alert',
          category: 'PHISHING',
          difficulty: 'EASY',
          points: 10,
          active: true,
          scenario: `From: Instagram Creator Support <support@instagrarn-helpdesk.com>
Subject: Your verified badge has been approved!
Content: "Hi Creator! Your profile qualifies for immediate verification badge. To complete identity confirmation and avoid badge cancellation within 24 hours, confirm your 2FA backup codes and password here: http://bit.ly/ig-badge-claim-99"`,
          question: 'How should you treat this message?',
          options: [
            'Enter your username and password, but refuse to enter 2FA codes',
            'Phishing: Treat as credential theft; report and delete without clicking shortened links',
            'Click the Bitly link to see if the page has an SSL padlock icon',
            'Forward to your followers to show you got verified'
          ],
          correctAnswer: 'Phishing: Treat as credential theft; report and delete without clicking shortened links',
          explanation: 'Notice the lookalike typo in the sender domain ("instagrarn" with "rn" mimicking "m") and the shortened link (bit.ly) hiding the destination. Legitimate platforms never ask for your 2FA backup codes via email.',
          warningSigns: [
            'Lookalike domain typo (instagrarn using "rn" instead of "m")',
            'Masked shortened URL (bit.ly)',
            'Request for confidential 2FA backup codes'
          ]
        },
        {
          title: 'Package Delivery Address Missing Notification',
          category: 'PHISHING',
          difficulty: 'MEDIUM',
          points: 20,
          active: true,
          scenario: `From: FedEx Parcel Center <updates@fedx-tracking-hub.info>
Subject: Delivery Failed: Street number missing for tracking #US-9823194
Content: "Your parcel could not be delivered due to an incomplete delivery address. A redelivery fee of $1.85 is required. Pay online within 4 hours to avoid package return: https://fedx-customs-pay.com"`,
          question: 'What is the correct cybersecurity assessment?',
          options: [
            'Pay the small $1.85 fee because it is negligible and worth the package',
            'Phishing: Smishing/phishing ploy designed to harvest credit card CVV and billing information',
            'Safe: Courier services always ask for minor redelivery fees online',
            'Forward your credit card number via reply email'
          ],
          correctAnswer: 'Phishing: Smishing/phishing ploy designed to harvest credit card CVV and billing information',
          explanation: 'Attackers use small dollar amounts ($1-$3) as bait so victims lower their guard. Once payment details are entered, cybercriminals drain the card or sell the credentials on illicit forums.',
          warningSigns: [
            'Misspelled sender domain (fedx instead of fedex.com)',
            'Small unexpected fee demanded to create low psychological resistance',
            'Unsolicited package tracking when you did not order or expect anything'
          ]
        },
        {
          title: 'IT Helpdesk Mandatory Office365 Password Reset',
          category: 'PHISHING',
          difficulty: 'HARD',
          points: 30,
          active: true,
          scenario: `From: Global IT Support <admin@tenant-portal.azurewebsites.net>
Subject: Action Required: Your organization email password expires in 2 hours
Content: "All staff are required to migrate to the new Single Sign-On certificate. Keep your existing password by logging in to synchronize active directory: https://login.microsoftonline.corp-auth.com"`,
          question: 'Why is this enterprise phishing simulation dangerous?',
          options: [
            'It is legitimate because Azure and Microsoft domains are trusted by default',
            'It is a sophisticated subdomain spoofing attack targeting corporate credentials',
            'It is safe because corporate policies often expire passwords in 2 hours',
            'It is safe as long as the user checks that the page uses HTTPS'
          ],
          correctAnswer: 'It is a sophisticated subdomain spoofing attack targeting corporate credentials',
          explanation: 'The URL "login.microsoftonline.corp-auth.com" actually belongs to the rogue root domain "corp-auth.com", NOT microsoft.com. Attackers often host phishing pages on cloud providers (Azure/AWS) to pass initial automated filters.',
          warningSigns: [
            'Subdomain spoofing: root domain is corp-auth.com, not microsoftonline.com',
            'Free cloud hosting subdomain (azurewebsites.net)',
            'False sense of convenience ("keep your existing password")'
          ]
        },

        // ==========================================
        // 2. PASSWORD CHALLENGES (6 challenges)
        // ==========================================
        {
          title: 'Selecting the Strongest Password Strategy',
          category: 'PASSWORD',
          difficulty: 'EASY',
          points: 10,
          active: true,
          scenario: `You are creating credentials for your primary email and cloud storage accounts. Which of the following candidate passwords offers the highest resistance against brute-force and dictionary attacks?`,
          question: 'Which password is mathematically and structurally the strongest?',
          options: [
            'P@ssw0rd2024!',
            'Correct-Horse-Battery-Staple#982',
            'JohnDoe_Nov1995',
            'qwertyuiop12345'
          ],
          correctAnswer: 'Correct-Horse-Battery-Staple#982',
          explanation: 'Passphrases combining 4+ random words with high character length (30+ characters) have exponentially higher entropy (trillions of years to crack) compared to predictable dictionary word substitutions like P@ssw0rd.',
          warningSigns: [
            'Predictable leetspeak (@ for a, 0 for o) is already indexed in attacker wordlists',
            'Personal dates (birthdays, names) are easily found via social engineering'
          ]
        },
        {
          title: 'Avoiding Password Reuse Vulnerabilities',
          category: 'PASSWORD',
          difficulty: 'MEDIUM',
          points: 20,
          active: true,
          scenario: `A user uses the password "SummerBreeze!88" for their personal gaming forum, university portal, bank account, and personal email. The gaming forum suffers a public data breach.`,
          question: 'What immediate cybersecurity threat does the user face?',
          options: [
            'No risk, because the gaming forum has no money in it',
            'Credential Stuffing attack across bank, university, and email accounts',
            'The attacker will only be able to access the game forum',
            'The browser will automatically change passwords on all other sites'
          ],
          correctAnswer: 'Credential Stuffing attack across bank, university, and email accounts',
          explanation: 'In a Credential Stuffing attack, cybercriminals use automated scripts to test breached username/password pairs against hundreds of other popular services like banks, email, and social networks.',
          warningSigns: [
            'Password reuse across low-security and high-security sites',
            'Absence of a password manager or unique per-site secrets'
          ]
        },
        {
          title: 'Evaluating Common Leetspeak vs Length Entropy',
          category: 'PASSWORD',
          difficulty: 'HARD',
          points: 30,
          active: true,
          scenario: `Compare the two passwords:
Password A: "Tr0ub4dor&3" (11 characters, mixed case, numbers, symbol)
Password B: "velvet-cloud-whistle-granite-42" (31 characters, dictionary words, hyphens, numbers)`,
          question: 'Which statement accurately represents their cryptographic resistance?',
          options: [
            'Password A is stronger because special characters always beat plain words regardless of length',
            'Password B is vastly stronger because length contributes exponentially more entropy than leetspeak',
            'Both passwords have identical security because both contain numbers',
            'Password A is impossible to crack with modern GPUs'
          ],
          correctAnswer: 'Password B is vastly stronger because length contributes exponentially more entropy than leetspeak',
          explanation: 'Entropy scales exponentially with total character length. Attackers utilize rule-based cracking tools (Hashcat, John the Ripper) that specifically target common substitutions like "0" for "o" and "4" for "a" in seconds.',
          warningSigns: [
            'Short length (<14 characters) even with symbols is vulnerable to modern hashcat clusters',
            'Common substitution rules are hardcoded into cracker dictionaries'
          ]
        },
        {
          title: 'Safe Password Storage and Recovery Practices',
          category: 'PASSWORD',
          difficulty: 'EASY',
          points: 10,
          active: true,
          scenario: `Which of the following represents the safest method to store and manage your complex passwords?`,
          question: 'What is the recommended industry best practice?',
          options: [
            'Write them down on a sticky note attached to the underside of your laptop keyboard',
            'Store them in an unencrypted plaintext file called "passwords.txt" on your desktop',
            'Use an encrypted, audited Password Manager with strong master passphrase and hardware 2FA',
            'Email the passwords to yourself with subject "Important Secrets"'
          ],
          correctAnswer: 'Use an encrypted, audited Password Manager with strong master passphrase and hardware 2FA',
          explanation: 'Encrypted password managers (Bitwarden, 1Password, KeePass) utilize client-side AES-256 encryption where only you possess the master decryption key.',
          warningSigns: [
            'Plaintext password files on desktop',
            'Unencrypted cloud storage of sensitive credentials'
          ]
        },
        {
          title: 'Multi-Factor Authentication (MFA) Selection',
          category: 'PASSWORD',
          difficulty: 'MEDIUM',
          points: 20,
          active: true,
          scenario: `You are securing your bank and cloud accounts with two-factor authentication. You can choose between SMS verification codes or an Authenticator App / Hardware Security Key (FIDO2/WebAuthn).`,
          question: 'Why are Authenticator Apps or FIDO2 Security Keys preferred over SMS codes?',
          options: [
            'SMS codes are vulnerable to SIM-swapping, interception, and SS7 telecom exploits',
            'SMS codes cost money for each text message',
            'Authenticator apps do not require any mathematical algorithm',
            'SMS codes expire too slowly compared to apps'
          ],
          correctAnswer: 'SMS codes are vulnerable to SIM-swapping, interception, and SS7 telecom exploits',
          explanation: 'SIM swapping allows an attacker to bribe or trick telecom operators into redirecting your phone number to their own SIM card, immediately intercepting SMS authentication codes.',
          warningSigns: [
            'Reliance on SMS 2FA for high-value financial accounts',
            'Telecom social engineering vulnerabilities'
          ]
        },

        // ==========================================
        // 3. FAKE QR CHALLENGES (6 challenges)
        // ==========================================
        {
          title: 'Public Parking Meter Physical Sticker Overlay',
          category: 'FAKE_QR',
          difficulty: 'EASY',
          points: 10,
          active: true,
          scenario: `You park your car in a downtown municipal parking zone. On the parking meter, you notice a shiny adhesive QR code sticker pasted unevenly directly OVER the original painted municipal instructions. When scanned, it opens: "http://park-city-paynow.online/quickpay"`,
          question: 'Is this QR code safe to pay your parking through?',
          options: [
            'SUSPICIOUS: Physical sticker tampering (quishing) directing to an unofficial domain',
            'SAFE: Cities frequently paste sticker updates over old payment meters',
            'SAFE: As long as the parking meter machine is turned on',
            'SAFE: Because the URL has the word "paynow" in it'
          ],
          correctAnswer: 'SUSPICIOUS: Physical sticker tampering (quishing) directing to an unofficial domain',
          explanation: 'Criminals paste fraudulent QR stickers over legitimate payment meters, vending machines, and posters ("Quishing"). The URL leads to an unofficial rogue site designed to steal payment card data.',
          warningSigns: [
            'Physical sticker slapped over original signage',
            'Unofficial top-level domain (.online instead of official city .gov)',
            'No official municipal branding or app integration'
          ]
        },
        {
          title: 'Restaurant Table QR Code Menu with Wi-Fi Credential Prompt',
          category: 'FAKE_QR',
          difficulty: 'MEDIUM',
          points: 20,
          active: true,
          scenario: `You sit down at a local café and scan the wooden table QR code expecting to view the dinner menu. The webpage opens and immediately displays: "To view menu, please connect your Google or Facebook account to authorize guest Wi-Fi access."`,
          question: 'What is your security assessment of this menu QR?',
          options: [
            'SUSPICIOUS: Menus are static documents and should never demand OAuth social logins or credentials',
            'SAFE: Cafes need to collect marketing demographics before showing menus',
            'SAFE: You can use your school email address to log in safely',
            'SAFE: Social logins have two-factor protection so there is no harm'
          ],
          correctAnswer: 'SUSPICIOUS: Menus are static documents and should never demand OAuth social logins or credentials',
          explanation: 'A legitimate digital menu never requires logging into personal social media or Google accounts. This is a rogue phishing landing page or data harvester.',
          warningSigns: [
            'Demand for personal account credentials to access public content',
            'OAuth permissions requesting profile and contact access for simple viewing'
          ]
        },
        {
          title: 'Transit Hub Free High-Speed Wi-Fi QR Poster',
          category: 'FAKE_QR',
          difficulty: 'HARD',
          points: 30,
          active: true,
          scenario: `At an airport departure lounge, an unofficial paper flyer taped to a pillar says: "SCAN FOR COMPLIMENTARY 5G ULTRA-FAST AIRPORT WI-FI". Scanning prompts you to install a custom "Airport-Secure-Profile.mobileconfig" SSL profile on your smartphone.`,
          question: 'What danger does installing this profile pose?',
          options: [
            'SUSPICIOUS: Installing root certificates or configuration profiles allows Man-In-The-Middle (MITM) decryption of all your encrypted web traffic',
            'SAFE: Airport profiles are required for secure certificate validation',
            'SAFE: Phones prevent any network profile from reading passwords',
            'SAFE: Apple and Android do not permit malicious Wi-Fi configurations'
          ],
          correctAnswer: 'SUSPICIOUS: Installing root certificates or configuration profiles allows Man-In-The-Middle (MITM) decryption of all your encrypted web traffic',
          explanation: 'Custom device configuration profiles (.mobileconfig) can install root Certificate Authority (CA) certs. This gives malicious actors full access to inspect your encrypted HTTPS traffic and banking sessions.',
          warningSigns: [
            'Request to install configuration profiles or root certificates',
            'Unofficial printed paper flyer taped in public spaces',
            'Offer of "free ultra-fast" utilities as bait'
          ]
        },
        {
          title: 'Conference Badge Raffle Scratch-and-Win QR',
          category: 'FAKE_QR',
          difficulty: 'EASY',
          points: 10,
          active: true,
          scenario: `During a tech conference, someone hands you a flyer: "You won a $500 Amazon Gift Card! Scan this QR code now to claim your payout directly to your Venmo or PayPal account." The QR points to: "http://claim-gift-cards-instant.xyz"`,
          question: 'How should you categorize this QR code?',
          options: [
            'SUSPICIOUS: Unsolicited prize claim with shady TLD (.xyz) aiming to steal payment accounts',
            'SAFE: Tech conferences regularly give out generous cash rewards to attendees',
            'SAFE: Venmo has buyer protection so scanning is risk-free',
            'SAFE: You can enter someone else\'s phone number to test it'
          ],
          correctAnswer: 'SUSPICIOUS: Unsolicited prize claim with shady TLD (.xyz) aiming to steal payment accounts',
          explanation: 'Unexpected gift card and prize claims are standard social engineering bait. The shady top level domain (.xyz) and demand for payment account credentials indicate financial fraud.',
          warningSigns: [
            'Unrealistic unsolicited reward ($500 free gift card)',
            'Suspicious non-standard domain extension (.xyz)',
            'Immediate demand for payment account credentials'
          ]
        },
        {
          title: 'Cryptocurrency ATM Emergency Maintenance QR',
          category: 'FAKE_QR',
          difficulty: 'MEDIUM',
          points: 20,
          active: true,
          scenario: `You are depositing cash at a crypto terminal. A paper sign on the machine screen reads: "Hardware malfunction! Scan this temporary backup deposit QR code to route your deposit safely."`,
          question: 'What is happening in this scenario?',
          options: [
            'SUSPICIOUS: Direct wallet address redirection fraud; any funds deposited will go to the thief\'s wallet',
            'SAFE: Backup paper QRs are standard bank redundancy protocols',
            'SAFE: Blockchain transactions can be reversed if it is fraudulent',
            'SAFE: As long as the QR scans in your official wallet'
          ],
          correctAnswer: 'SUSPICIOUS: Direct wallet address redirection fraud; any funds deposited will go to the thief\'s wallet',
          explanation: 'Physical social engineering on ATMs and crypto kiosks frequently uses fake "maintenance" signs. Blockchain transactions are irreversible, meaning any sent funds are permanently stolen.',
          warningSigns: [
            'Handwritten or paper notice claiming hardware failure',
            'Redirection of monetary transaction to an external address',
            'Pressure to complete transaction outside the certified machine interface'
          ]
        },

        // ==========================================
        // 4. SCAM MESSAGE CHALLENGES (6 challenges)
        // ==========================================
        {
          title: 'Bank KYC Urgent Suspension SMS Alert',
          category: 'SCAM_MESSAGE',
          difficulty: 'EASY',
          points: 10,
          active: true,
          scenario: `SMS from "+1 (800) 555-0199":
"WellsFargo ALERT: Your checking account access has been restricted due to expired KYC identity documents. Update within 2 hours to avoid $150 penalty and account shutdown: https://wellsfargo-kyc-update.com/id"`,
          question: 'How should you respond to this text message?',
          options: [
            'SCAM: Do not click the link; verify status only by calling the official customer service number on the back of your card',
            'SAFE: Click and upload driver\'s license to avoid the $150 penalty',
            'SAFE: Reply STOP to prevent any further charges',
            'SAFE: Forward your bank account number to verify you are a customer'
          ],
          correctAnswer: 'SCAM: Do not click the link; verify status only by calling the official customer service number on the back of your card',
          explanation: 'Financial institutions never send text messages with aggressive penalty threats ($150 fine) or demanding sensitive KYC identification documents via random web links.',
          warningSigns: [
            'Threat of immediate financial penalty ($150 charge)',
            'Artificial urgency (2-hour deadline)',
            'Unofficial domain pretending to be Wells Fargo'
          ]
        },
        {
          title: 'WhatsApp Work-From-Home High Pay Recruitment',
          category: 'SCAM_MESSAGE',
          difficulty: 'MEDIUM',
          points: 20,
          active: true,
          scenario: `WhatsApp message from unknown international number (+234):
"Hello! I am Sarah from Global Talent HR. We saw your resume. Earn $300-$800 daily working 30 minutes from your smartphone by liking hotel YouTube videos. To begin your probationary task, transfer a $50 refundable security deposit to our Telegram supervisor."`,
          question: 'What kind of cyber threat is this message?',
          options: [
            'SCAM: Task scam / advance-fee fraud requiring upfront deposits for nonexistent freelance tasks',
            'SAFE: Modern digital marketing agencies pay people to like social media content',
            'SAFE: A $50 deposit is reasonable because they promised it is 100% refundable',
            'SAFE: As long as you communicate on Telegram instead of WhatsApp'
          ],
          correctAnswer: 'SCAM: Task scam / advance-fee fraud requiring upfront deposits for nonexistent freelance tasks',
          explanation: 'This is a textbook "Task Scam". Victims are lured with unrealistic daily pay ($300-$800/day for trivial tasks) and asked to send "security deposits" or "upgrade fees" which are never refunded.',
          warningSigns: [
            'Unsolicited recruiter message from an overseas country code',
            'Unrealistic compensation for trivial activities (liking videos for $500/day)',
            'Requirement to pay money upfront (advance fee) to work'
          ]
        },
        {
          title: 'Government Tax Authority Immediate Audit Notice',
          category: 'SCAM_MESSAGE',
          difficulty: 'MEDIUM',
          points: 20,
          active: true,
          scenario: `SMS notification from "IRS-GOV-ALERT":
"INTERNAL REVENUE SERVICE: Final notice regarding outstanding tax deficiency of $1,420.30. A federal warrant will be issued for your arrest by local sheriffs today. Settle immediately with Apple Gift Cards or Bitcoin to cancel the warrant: call 888-921-9922."`,
          question: 'What obvious indicator guarantees this is a criminal fraud attempt?',
          options: [
            'Demanding tax debts or official penalties be paid via gift cards or cryptocurrency',
            'The tax amount has cents included',
            'Federal agencies only use email, never phone calls',
            'Local sheriffs only work on weekends'
          ],
          correctAnswer: 'Demanding tax debts or official penalties be paid via gift cards or cryptocurrency',
          explanation: 'No legitimate government tax agency (IRS, HMRC, CRA) EVER requests payments via gift cards, prepaid debit cards, or cryptocurrency, nor do they threaten same-day police arrest over SMS.',
          warningSigns: [
            'Demand for gift cards or cryptocurrency payment',
            'Threat of immediate police arrest or physical raid',
            'Informal SMS communication for formal legal notices'
          ]
        },
        {
          title: 'Family Emergency Impersonation ("Hi Mom/Dad")',
          category: 'SCAM_MESSAGE',
          difficulty: 'HARD',
          points: 30,
          active: true,
          scenario: `SMS message from an unknown local cell number:
"Hi Dad, my phone fell in the sink and the screen died. This is my friend\'s temporary phone. I urgently need to pay my college rent before 5 PM today or I\'ll be evicted. Can you please Zelle $650 to my landlord\'s account: landlord-pay@quicktransfers.cc?"`,
          question: 'What is the correct protocol to handle this emergency claim?',
          options: [
            'SCAM ATTEMPT: Stop and independently contact your child on their known number or call mutual contacts before sending any money',
            'SAFE: Send the money right away because emergencies require rapid assistance',
            'SAFE: Send half the money first to test the landlord',
            'SAFE: Ask the friend for their driver\'s license'
          ],
          correctAnswer: 'SCAM ATTEMPT: Stop and independently contact your child on their known number or call mutual contacts before sending any money',
          explanation: 'This is the widespread "Hi Mom/Dad" family impersonation scam. Scammers exploit parental panic. Always verify claims through alternative out-of-band channels before transferring funds.',
          warningSigns: [
            'Claim of broken device and temporary friend phone',
            'High emotional pressure and urgent financial deadline',
            'Request to send funds to an unverified third-party account'
          ]
        },
        {
          title: 'Two-Factor Authentication One-Time Passcode (OTP) Phishing',
          category: 'SCAM_MESSAGE',
          difficulty: 'MEDIUM',
          points: 20,
          active: true,
          scenario: `You receive a legitimate automated 2FA code from Google: "189423 is your Google verification code. Do not share it with anyone."
Ten seconds later, you receive a text from a stranger:
"Hi, sorry I accidentally mistyped my phone number when signing up for my account and Google sent the code to you. Could you please text me back the 6-digit code so I can login?"`,
          question: 'What should you do with the 6-digit code?',
          options: [
            'SCAM: Never share the code. An attacker has your password and is trying to bypass your two-factor prompt',
            'Be polite and text back the 6-digit code since it was an honest mistake',
            'Post the code in a group chat asking if anyone recognizes it',
            'Change the last digit and send it to them'
          ],
          correctAnswer: 'SCAM: Never share the code. An attacker has your password and is trying to bypass your two-factor prompt',
          explanation: 'The attacker already compromised your password and triggered the OTP. By convincing you to forward the code, they successfully bypass two-factor authentication and hijack your account.',
          warningSigns: [
            'Unsolicited OTP received without user initiation',
            'Stranger requesting your private authentication code',
            'Code message explicitly stating "Do not share it with anyone"'
          ]
        }
      ];

      for (const ch of challenges) {
        await Challenge.create(ch);
      }
      console.log(`✅ ${challenges.length} realistic cybersecurity challenges seeded.`);
    }

    const achievementCount = await Achievement.countDocuments();
    if (achievementCount === 0) {
      console.log('🌱 Seeding achievements...');
      const defaultAchievements = [
        {
          code: 'PHISHING_HUNTER',
          name: 'Phishing Hunter',
          description: 'Identify 5 phishing attempts correctly.',
          icon: 'Fish',
          condition: 'Answer 5 phishing challenges correctly'
        },
        {
          code: 'PASSWORD_GUARDIAN',
          name: 'Password Guardian',
          description: 'Correctly answer 5 password challenges.',
          icon: 'Lock',
          condition: 'Answer 5 password challenges correctly'
        },
        {
          code: 'QR_DETECTIVE',
          name: 'QR Detective',
          description: 'Correctly identify 5 suspicious QR scenarios.',
          icon: 'QrCode',
          condition: 'Answer 5 fake QR challenges correctly'
        },
        {
          code: 'SCAM_SPOTTER',
          name: 'Scam Spotter',
          description: 'Correctly identify 5 scam messages.',
          icon: 'MessageSquareWarning',
          condition: 'Answer 5 scam messages correctly'
        },
        {
          code: 'CYBER_SAFETY_EXPERT',
          name: 'Cyber Safety Expert',
          description: 'Achieve 76% or higher on an escape room run.',
          icon: 'Award',
          condition: 'Score >= 76% in an escape room session'
        },
        {
          code: 'FLAWLESS_ESCAPE',
          name: 'Flawless Escape',
          description: 'Escape without losing any lives (all 3 hearts intact).',
          icon: 'ShieldCheck',
          condition: 'Complete escape room with 3 lives remaining'
        },
        {
          code: 'FIRST_ESCAPE',
          name: 'Escape Artist',
          description: 'Successfully unlock and escape the digital safety room.',
          icon: 'Key',
          condition: 'Complete 1 full escape session'
        }
      ];

      for (const ach of defaultAchievements) {
        await Achievement.create(ach);
      }
      console.log('✅ Default achievements seeded.');
    }
  } catch (error) {
    console.error('Error during database seed:', error);
  }
};
