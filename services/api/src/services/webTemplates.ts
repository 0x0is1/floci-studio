export interface WebTemplateParams {
  id: string;
  name: string;
  port: number;
  template?: string;
  ami?: string;
  instanceType?: string;
  s3?: string;
  sqs?: string;
}

export function getAmiLabel(ami?: string): { os: string; distro: string; badge: string } {
  if (!ami || ami.includes('ubuntu')) return { os: 'Ubuntu 24.04 LTS', distro: 'Ubuntu Linux (noble)', badge: 'UBUNTU 24.04' };
  if (ami.includes('2023') || ami.includes('al2023') || ami === 'ami-0abcdef1234567891') return { os: 'Amazon Linux 2023', distro: 'AL2023 Kernel 6.1', badge: 'AMAZON LINUX' };
  if (ami.includes('amzn2') || ami === 'ami-0abcdef1234567890') return { os: 'Amazon Linux 2', distro: 'AL2 Kernel 5.10', badge: 'AMAZON LINUX 2' };
  if (ami.includes('debian')) return { os: 'Debian 12', distro: 'Debian GNU/Linux 12', badge: 'DEBIAN 12' };
  if (ami.includes('alpine')) return { os: 'Alpine Linux', distro: 'Alpine 3.19 Musl', badge: 'ALPINE' };
  if (ami.includes('Windows') || ami === 'ami-0abcdef1234567893') return { os: 'Windows Server 2022', distro: 'Microsoft Windows', badge: 'WIN SERVER 2022' };
  return { os: 'Linux (Cloud Instance)', distro: 'Amazon Kernel', badge: 'LINUX' };
}

export function getOsReleaseContent(ami?: string): string {
  if (!ami || ami.includes('ubuntu')) {
    return 'NAME="Ubuntu"\nVERSION="24.04 LTS (Noble Numbat)"\nID=ubuntu\nID_LIKE=debian\nPRETTY_NAME="Ubuntu 24.04 LTS"\nVERSION_ID="24.04"\nHOME_URL="https://www.ubuntu.com/"\nSUPPORT_URL="https://help.ubuntu.com/"\nBUG_REPORT_URL="https://bugs.launchpad.net/ubuntu/"\nUBUNTU_CODENAME=noble\n';
  }
  if (ami.includes('2023') || ami.includes('al2023') || ami === 'ami-0abcdef1234567891') {
    return 'NAME="Amazon Linux"\nVERSION="2023"\nID="amzn"\nID_LIKE="fedora"\nVERSION_ID="2023"\nPLATFORM_ID="platform:al2023"\nPRETTY_NAME="Amazon Linux 2023"\nANSI_COLOR="0;33"\nCPE_NAME="cpe:2.3:o:amazon:amazon_linux:2023"\nHOME_URL="https://aws.amazon.com/linux/amazon-linux-2023/"\n';
  }
  if (ami.includes('amzn2') || ami === 'ami-0abcdef1234567890') {
    return 'NAME="Amazon Linux"\nVERSION="2"\nID="amzn"\nID_LIKE="centos rhel fedora"\nVERSION_ID="2"\nPRETTY_NAME="Amazon Linux 2"\nANSI_COLOR="0;33"\nCPE_NAME="cpe:2.3:o:amazon:amazon_linux:2"\nHOME_URL="https://amazonlinux.com/"\n';
  }
  if (ami.includes('debian')) {
    return 'PRETTY_NAME="Debian GNU/Linux 12 (bookworm)"\nNAME="Debian GNU/Linux"\nVERSION_ID="12"\nVERSION="12 (bookworm)"\nVERSION_CODENAME=bookworm\nID=debian\nHOME_URL="https://www.debian.org/"\n';
  }
  return 'NAME="Alpine Linux"\nID=alpine\nVERSION_ID="3.20.0"\nPRETTY_NAME="Alpine Linux v3.20"\n';
}

export function generateWebHtml(params: WebTemplateParams): string {
  const { id, name, port, template = 'nginx', ami, instanceType = 't3.micro', s3 = 'None', sqs = 'None' } = params;
  const amiInfo = getAmiLabel(ami);

  const stackDetails: Record<string, { badge: string; color: string; desc: string; detail: string }> = {
    nginx: { badge: 'NGINX 1.25 REVERSE PROXY', color: '#34d399', desc: 'Event-driven, asynchronous HTTP reverse proxy server active on Floci EC2 container.', detail: 'Proxy Pass: http://127.0.0.1:8080 | Keep-Alive: Enabled | Gzip: On' },
    nodejs: { badge: 'NODE.JS EXPRESS / ELYSIA API', color: '#38bdf8', desc: 'Node.js REST microservice connected to AWS SDK client environment.', detail: 'Endpoints: GET /api/health -> 200 OK | GET /api/v1/metrics -> Active' },
    fastapi: { badge: 'PYTHON FASTAPI (UVICORN)', color: '#a855f7', desc: 'Asynchronous Python ASGI microservice with interactive OpenAPI docs at /docs.', detail: 'Docs: /docs (Swagger UI) | /openapi.json | Schema: OpenAPI 3.1.0' },
    static: { badge: 'STATIC HTML5 APPLICATION', color: '#f59e0b', desc: 'Static documentation and single-page web assets served directly on port ' + port + '.', detail: 'Assets: index.html, styles.css | Compression: Brotli / Gzip Enabled' },
  };

  const stack = stackDetails[template] || stackDetails.nginx;

  return `<!DOCTYPE html><html><head><title>${name} - ${amiInfo.os} (${stack.badge})</title><meta charset="utf-8"/><style>body{background:#090d16;color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;padding:48px 24px;display:flex;justify-content:center;}main{max-width:680px;width:100%;background:#0f172a;border:1px solid #1e293b;border-radius:12px;padding:32px;box-shadow:0 8px 30px rgba(0,0,0,0.5);}.badges{display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;}.badge{display:inline-block;padding:4px 10px;border-radius:9999px;font-size:11px;font-family:monospace;font-weight:600;background:rgba(255,255,255,0.05);color:${stack.color};border:1px solid ${stack.color}40;}.os-badge{display:inline-block;padding:4px 10px;border-radius:9999px;font-size:11px;font-family:monospace;font-weight:600;background:rgba(234,88,12,0.1);color:#fb923c;border:1px solid rgba(234,88,12,0.3);}h1{margin:0 0 8px;font-size:22px;}p{color:#94a3b8;font-size:13px;line-height:1.6;}.card{background:#090d16;border:1px solid #1e293b;border-radius:8px;padding:16px;margin:20px 0;font-size:12px;font-family:monospace;}.meta{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:16px;}.meta-item span{color:#64748b;display:block;margin-bottom:2px;}.meta-item strong{color:#e2e8f0;}.detail{margin-top:12px;padding-top:12px;border-top:1px solid #1e293b;color:#38bdf8;font-size:11px;}</style></head><body><main><div class="badges"><span class="os-badge">${amiInfo.os.toUpperCase()}</span><span class="badge">${stack.badge}</span><span class="badge" style="color:#a855f7;border-color:#a855f740;">${instanceType.toUpperCase()}</span></div><h1>${name}</h1><p>Running on <strong>${amiInfo.distro}</strong>. ${stack.desc}</p><p>Active local EC2 web endpoint listening on <code>localhost:${port}</code>.</p><div class="card"><div class="meta"><div class="meta-item"><span>INSTANCE ID</span><strong>${id}</strong></div><div class="meta-item"><span>AMI IMAGE</span><strong>${ami || 'ami-ubuntu2404'}</strong></div><div class="meta-item"><span>INSTANCE TYPE</span><strong>${instanceType}</strong></div><div class="meta-item"><span>S3 BUCKET</span><strong>${s3}</strong></div><div class="meta-item"><span>SQS QUEUE</span><strong>${sqs}</strong></div><div class="meta-item"><span>REGION</span><strong>us-east-1</strong></div></div><div class="detail">${stack.detail}</div></div></main></body></html>`;
}
