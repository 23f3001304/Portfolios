export const junksnap = {
  id: 'PRJ-015',
  slug: 'junksnap',
  name: 'JunkSnap',
  tagline: 'Snap a waste dump, get it on the map, and send the right office a letter. Built on AWS in three days by a team of three.',
  when: 'Oct 2026',
  status: 'LIVE',
  stack: ['React', 'TypeScript', 'Tauri 2', 'Node.js', 'FastAPI', 'Amazon EKS', 'Amazon Bedrock', 'Rekognition', 'YOLO', 'DynamoDB'],
  metrics: [
    { value: '121',   unit: '',  label: 'reports in the Jodhpur field run' },
    { value: '0.929', unit: '',  label: 'Nova Lite accuracy on waste dumps' },
    { value: '10',    unit: '',  label: 'people needed to verify a site' },
    { value: '20',    unit: 'm', label: 'radius where reports join one site' },
  ],
  accent: '#14a394',
  hero: {
    light: '/projects/junksnap/product-flat-light.webp',
    dark: '/projects/junksnap/product-flat-dark.webp',
  },
  heroAlt: 'JunkSnap on three phones: the map of Jodhpur with a reported site, a site sheet with its blurred photo and 1 of 10 people confirmed, and a draft letter to the Commissioner of the Jodhpur Municipal Corporation',
  overview: [
    'JunkSnap turns a photo of a waste dump into something a city office can act on. You snap the dump in the app. JunkSnap blurs faces and number plates, checks the photo with a stack of models, puts it on the map as a site, works out its local body, MLA seat and MP seat, and drafts a letter that quotes the rules word for word. You file the letter yourself. Nothing is sent automatically.',
    'We built it in three days, 8 to 11 October 2026, for Environmental Hacks (the Bharat Builds Tour by WeMakeDevs and AWS) in the Waste and Energy track. The team was Girish, Harshit and me, and Jodhpur was the pilot city.',
    'My part was the React web app and the Android app (Tauri), the API and the report worker on EKS, the ML verification (a YOLO detector, a SigLIP classifier and an Amazon Bedrock Nova judge), the privacy blur with Rekognition, merging reports into sites, the letters with the word-for-word quote verifier, and the area scores. I also ran the deploys and the releases. I wrote up the whole build on AWS Builder Center, and this page is the shorter version.',
  ],
  sections: [
    {
      title: 'Why a dump stays a dump',
      body: [
        'A dump is not only the city\'s failure. People dump on empty plots, often because there is nowhere legal to put their waste. So a dump has three possible causes: the city does not clear it, people keep dumping there, or there is no bin nearby.',
        'Nobody measures which cause it is, so nobody knows who should act. JunkSnap tries to measure all three: how fast the city clears dumps, how much residents dump, and whether people have anywhere legal to put waste.',
      ],
      figure: { id: 'FIG 15.1', caption: 'The first-run card that explains the three causes, the map opening on Jodhpur, and the list of sites in view.', src: '/projects/junksnap/how.png', alt: 'Three JunkSnap phone screens: an onboarding card saying waste piles up for three reasons, the map of Jodhpur with assembly seat boundaries and one site marked 1 of 10, and the list view with one overflowing bin in Soorsagar', noInvert: true },
    },
    {
      title: 'Snap a photo, and the server does the rest',
      body: [
        'You can only report through the in-app camera, never from the gallery, and every photo carries a GPS fix. You can also record a video of up to 60 seconds. For a video, the server cuts one frame per second, places each frame on the GPS track recorded alongside it, and drops frames without a close and accurate fix.',
        'On phones that are fast enough, a small YOLO model runs in the browser (a 2.8 MB int8 ONNX file in a WASM worker) and draws live boxes while you aim. Those boxes are only hints. The server always checks again.',
        'The phone uploads the photo straight to a private S3 bucket with a presigned URL and then posts the report, with an offline queue that retries when there is no network. The API puts the report on an SQS queue and the worker picks it up, so a slow model call never blocks the phone. Every step is idempotent per report, so an SQS retry cannot count anything twice. After three failed attempts the worker marks the report `needs_review` and the message moves to a dead-letter queue, so no report waits forever.',
      ],
      figure: { id: 'FIG 15.2', caption: 'Snap in the app camera, the report saved and queued, and the Activity page showing what was checked. Sample data from the app\'s mock mode.', src: '/projects/junksnap/snap.png', alt: 'Three JunkSnap phone screens in mock mode: the in-app camera pointed at an overflowing bin with GPS accuracy and a shutter, a report-saved screen with upload and queue steps, and the Activity page with the report just sent', noInvert: true },
    },
    {
      title: 'Blur first, and never trust "found nothing"',
      body: [
        'Before any public copy of a photo exists, the worker checks it for unsafe content with Rekognition and blurs faces and number plates. Only the blurred copy is ever public. The original stays in a private bucket encrypted with KMS, and the ML service cannot even read the originals.',
        'Rekognition has no number plate detector, so a plate is found by combining text boxes with vehicle boxes. That worked in daylight. Then a night photo from Jodhpur went public with a readable motorbike plate and two people unblurred, because face and text detection found nothing in the low light, so nothing was blurred.',
        'So the blur no longer trusts "found nothing". People and vehicles from the label detector are blurred where a face or plate would be, even when none was found, and dark photos get more blur, not less. Every public copy already on the stage was then re-blurred from its original. Blurring too much is better than leaking.',
      ],
      blocks: [
        { kind: 'code', lang: 'js', caption: 'the blur rules after the night photo', code: [
          '// person found, no face inside    -> blur the top quarter of the box',
          '// vehicle found, no plate inside   -> blur the lower 60% of the box',
          '//                                     (two- and three-wheelers: 75%)',
          '// dark photo, low confidence, or a small box',
          '//                                  -> blur the whole box',
          '// dark photo and nothing found     -> blur the lower 45% of the image',
        ] },
      ],
    },
    {
      title: 'Three detectors and a judge',
      body: [
        'The ML service is a Python FastAPI service with no public route. Only the worker calls it, and it only ever sees the blurred copy. It scores each photo with three signals: Rekognition labels, a YOLO26 detector we trained, and a classifier on SigLIP 2 image embeddings.',
        'A vision model also judges every photo: Amazon Nova Lite on Bedrock, then Nova Pro, then an OpenAI model if both fail. It answers yes, no or uncertain for each thing the claim needs, like garbage, a bin, an overflowing bin, or a usable photo. For waste-dump and no-bin reports, a logistic-regression meta-learner turns all of this into one probability.',
        'The models only gate each photo. A photo they reject stops there, unless the trained detector is sure, in which case it goes to the community instead. If the judge is unsure, the app asks the reporter to keep the report only if they are 100% sure. Every decision records the provider, model and version that made it.',
        'One caveat I want to be clear about: every number here is measured on public datasets (QR4Change, TACO, garbage_od and D-Fire). We have not measured accuracy on Jodhpur photos yet.',
      ],
      blocks: [
        { kind: 'code', lang: 'js', caption: 'each signal on the 184 QR4Change test photos (docs/ml/eval.md)', code: [
          '//                      precision   recall    F1     ECE',
          '// Rekognition labels       0.667    0.954   0.785  0.113',
          '// YOLO                     0.933    0.646   0.764  0.150',
          '// SigLIP 2 classifier      0.984    0.954   0.969  0.018',
          '',
          '// meta-learner: accuracy 0.978, ECE 0.019',
          '// (fixed weights had the same accuracy, but ECE 0.115)',
        ] },
      ],
    },
    {
      title: 'Picking the judge',
      body: [
        'We tested several judges on 224 public test photos. Nova Lite was the most accurate on "is this a waste dump" at 0.929, and also the cheapest, at about $0.17 per 1,000 photos with a median of 1.5 seconds. Nova Pro scored 0.908. The Bedrock Converse API made switching models a one-line change of the model ID.',
        'The plan was to use Claude on Bedrock, but the calls kept failing. The logs showed that Bedrock refuses Claude models on an account until Anthropic\'s use-case form is submitted, so we moved to Nova.',
        'At first the judge only ran when the detectors were unsure. Then a night photo of a real site under a flyover got rejected without the judge ever seeing it, because the detectors had not been trained on that report type. So the judge now runs on every photo. Its first prompt also gave one label per photo, which sent too many clean bins and streets to the community. Changing it to a yes, no or uncertain answer per attribute brought clean photos that got accepted down from 59 of 119 to 7, while real waste that got rejected stayed at 3 of 65.',
      ],
    },
    {
      title: 'Reports become sites',
      body: [
        'Reports of the same type within 20 metres always join one site. From 20 up to 40 metres they join only if the two photos look alike (SigLIP 2 cosine of 0.88 or more). A site shows on the map from its first photo that passes, as "1 of 10", and it is verified only when 10 different people back it with a photo or a yes vote. A model never verifies a site on its own.',
        'The field run found two bugs here. Two photos of one dump less than a metre apart became two sites, because the photo match was too strict for close-ups taken from different angles. That is why anything within 20 metres now always merges.',
        'The second bug was a race. Phones on 3G flush their queued reports together, the worker handled a batch in parallel, and both reports found no site and each created one. Even one after the other, the lookup reads a DynamoDB index that is only eventually consistent, so a site created a moment ago could be missed. Now reports in the same small area take turns choosing a site, and the worker remembers the sites it just created until the index catches up. A script then folded the 11 duplicates into their sites using conditional writes, so it ran safely on production while the worker kept going.',
      ],
      figure: { id: 'FIG 15.3', caption: 'A pin on the map, the site sheet with its seats and actions, and the blurred photo with 1 of 10 people confirmed.', src: '/projects/junksnap/site.png', alt: 'Three JunkSnap phone screens: a pin card for an overflowing bin with View site, the site sheet with ward, MLA seat and MP seat and Confirm, Me too, Cleaned, Letter and Share actions, and the site photo with faces and plates blurred and 1 of 10 people confirmed', noInvert: true },
    },
    {
      title: 'Letters that quote the rules word for word',
      body: [
        'For any open site, the API picks who to write to and which rule clauses apply, from hashed copies of the official texts, like the Solid Waste Management Rules, 2026. A site letter goes to the head of the local body, with the MLA and MP copied for attention where those seats are known. Amazon Location gives the state, district and town, and our own boundary files give the assembly and Lok Sabha seats.',
        'A model on Bedrock writes the prose, and then a verifier checks every quote against the official text, word for word. If any quote does not match, the letter falls back to a template with the same verified citations. The letter also states exactly how many residents back the site so far ("N of 10 people confirmed so far"). If the model\'s prose calls an unverified site verified, the template is used instead.',
        'Every letter carries evidence: report counts, distinct reporters, dates and blurred photos. It can be printed to PDF or shared, in English or Hindi. The resident files it. JunkSnap never sends anything.',
      ],
      figure: { id: 'FIG 15.4', caption: 'The site\'s local body and seats, a draft letter to the Commissioner (sample data with placeholder quotes), and the site sheet in Hindi.', src: '/projects/junksnap/letter.png', alt: 'Three JunkSnap phone screens: the Location card with local body, district, ward, assembly seat and Lok Sabha seat, a draft letter to the Commissioner of the Jodhpur Municipal Corporation copied to the MLA and MP, and a site sheet in Hindi', noInvert: true },
    },
    {
      title: 'Area scores, only once there is enough data',
      body: [
        'Every 15 minutes a CronJob scores each ward, assembly seat, Lok Sabha seat and district on three things: how fast the city clears reported sites, how rarely people dump there, and how close bins and pickup are. It also gives a short diagnosis, like an infrastructure gap or a repeat spot.',
        'A score only shows once an area has 10 verified reports. Before that the page shows counts and says plainly that there is not enough data yet. That way an area is never judged on two or three reports.',
        'A missing bin cannot be photographed, so there is also a report for "there is no dustbin within 1 km of here". Reports within 500 metres of each other join one community zone, drawn as a 1 km circle, and it is verified when 10 people back it.',
      ],
      figure: { id: 'FIG 15.5', caption: 'The Areas map, the Soorsagar area page with scores held back until 10 verified reports, and the ranking of Jodhpur\'s seats.', src: '/projects/junksnap/areas.png', alt: 'Three JunkSnap phone screens: the Areas map of Jodhpur with assembly seats, the Soorsagar area page with city response, citizen care and bin access showing no score yet, and a ranking of Jodhpur assembly seats', noInvert: true },
    },
    {
      title: 'One app on the web and on Android',
      body: [
        'The web app is React with MapLibre, with light, dark and system themes, Hindi and English, and a desktop layout with a side panel. The Android app is a Tauri 2 shell around the same build, adding camera and location permissions, native share and print to PDF. A GitHub Actions workflow builds the release-signed APK and publishes it as a GitHub Release, and share links open the installed app through verified App Links.',
        'One bug only showed up on Android. The browser\'s permission check did not match the Android app\'s real location permission, so voting looked possible and then failed. Now the app asks for location when you tap an action that needs it, and if it is blocked, it tells you how to turn it back on.',
      ],
    },
    {
      title: 'Running it on EKS',
      body: [
        'The original plan was Lambda functions with Step Functions. I moved it to one Amazon EKS cluster in Auto Mode, so we never had to manage nodes, and the worker runs the report pipeline straight from SQS. All the TypeScript runs from one image as three workloads (api, worker and scores), and only the ML service is Python, because that is where the ML libraries are.',
        'CloudFront sits in front of an Application Load Balancer that only accepts traffic from CloudFront. Each workload gets its own narrow IAM role through EKS Pod Identity, so there are no keys in pods. Each stage is one CloudFormation stack. The deploy script builds the images tagged with the git commit, renders the Kustomize overlay, applies it and points CloudFront at the ALB. The demo stage is deployed only from a clean main. Everything runs in Mumbai (ap-south-1).',
      ],
      blocks: [
        { kind: 'code', lang: 'yaml', caption: 'one cluster, five workloads', code: [
          'api       Deployment   every public route, letters       junksnap-server',
          'worker    Deployment   SQS report pipeline, 1 replica    junksnap-server',
          'ml        Deployment   POST /internal/verify only        junksnap-ml',
          'scores    CronJob      area scores, every 15 minutes     junksnap-server',
          'crawler   CronJob      ward data, hourly                 junksnap-crawler',
        ] },
      ],
    },
    {
      title: 'The field run',
      body: [
        'On 11 October, four of us walked around Jodhpur for about two hours and twenty minutes and filed 121 reports through the app. 114 passed the checks and 7 were rejected: an indoor photo, two dark video frames, a "dirty water" photo of a dry plot, a bin report with no bin in the photo, one unclear rubble photo, and one photo the moderation flagged as graphic.',
        'After merging the duplicates there were 44 open sites. None of them is verified yet, because a site needs 10 different people to back it, and that needs real neighbours, not a hackathon team.',
      ],
    },
  ],
  conclusion: [
    'Looking back, most of my work on JunkSnap was about making each step careful with what it claims: blur when unsure, let people verify a site instead of a model, hold back scores until there is enough data, and never put a quote in a letter that does not match the official text word for word.',
    'What is left: getting real neighbours to back the first sites, measuring the models on Jodhpur photos, replacing our rough ward shapes with reviewed ones (a wrong ward would send a letter to the wrong councillor, so we do not use them yet), and adding more cities.',
  ],
  figma: null,
  links: [
    { label: 'Website', href: 'https://junksnap.coehemang.dev' },
    { label: 'GitHub', href: 'https://github.com/Girish-Garg/JunkSnap' },
    { label: 'Blog post', href: 'https://builder.aws.com/content/3KYKuL3ODZDI9rlxQkSkAYgKkep/junksnap-snap-a-waste-dump-get-it-on-the-map-send-the-right-office-a-letter' },
    { label: 'Demo video', href: 'https://youtu.be/cdspylgoFm4' },
    { label: 'Android APK', href: 'https://github.com/Girish-Garg/JunkSnap/releases/latest' },
  ],
};
