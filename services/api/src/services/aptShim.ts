export function getPkgManagerShims(): string {
  return `#!/bin/sh
case "$1" in
  update|upgrade)
    apk update
    ;;
  install|add)
    shift
    PKGS=""
    for arg in "$@"; do
      case "$arg" in
        -y|--yes|-q|--quiet) ;;
        psql|postgresql|postgresql-client|postgresql-client-*) PKGS="$PKGS postgresql-client" ;;
        mysql|mysql-client) PKGS="$PKGS mariadb-client" ;;
        python3-pip) PKGS="$PKGS py3-pip" ;;
        *) PKGS="$PKGS $arg" ;;
      esac
    done
    [ -n "$PKGS" ] && apk add --no-cache $PKGS
    ;;
  *)
    apk "$@"
    ;;
esac`;
}

export function getSudoShim(): string {
  return '#!/bin/sh\nexec "$@"\n';
}

export function getBootstrapScript(): string {
  const aptB64 = Buffer.from(getPkgManagerShims()).toString('base64');
  const sudoB64 = Buffer.from(getSudoShim()).toString('base64');
  return `[ ! -f /usr/local/bin/apt ] && echo '${aptB64}' | base64 -d > /usr/local/bin/apt && chmod +x /usr/local/bin/apt && ln -sf /usr/local/bin/apt /usr/local/bin/apt-get && ln -sf /usr/local/bin/apt /usr/local/bin/dnf && ln -sf /usr/local/bin/apt /usr/local/bin/yum && echo '${sudoB64}' | base64 -d > /usr/local/bin/sudo && chmod +x /usr/local/bin/sudo; (which psql >/dev/null 2>&1 || apk add --no-cache postgresql-client >/dev/null 2>&1 &)`;
}

