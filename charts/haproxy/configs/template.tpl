global
  pidfile /etc/haproxy/haproxy.pid
  master-worker
  mworker-max-reloads {{ .Values.config.haproxy.maxReloads | default "20" }}
  log stdout local0
  maxconn 500000
# expose-fd may be used to handle more than 1 reloads per second with more than 1000 CPS
  stats socket /var/run/haproxy.sock mode 660 expose-fd listeners level admin
  stats timeout 30s
# Process number shouldn't be set to more than 1 if we are using stick-tables
  nbproc 1
  nbthread {{ .Values.config.haproxy.nbthread | default "2" }}
  cpu-map {{ .Values.config.haproxy.cpuMap | default "auto:1/1-2 0-1" }}
# random health-checks spread (2-50% spread in our case)
  spread-checks 2..50

defaults
  mode http
  log global
# together with option redispatch too small timeout connect value may break out logic for stick tables if we have health-checks issues
  timeout connect 20s
# if timeout tunnel is not set timeout client is used for WS.
  timeout client 20s
  timeout server 60s
  timeout client-fin 1s
  timeout server-fin 1s
  timeout http-request 10s
  timeout http-keep-alive 300s
  timeout tunnel 3600s # to be removed after bor manager hotfix

  option httplog
# don't enable it! it breaks stick-table logic
# option redispatch
  option dontlognull
{{- if .Values.config.haproxy.debug }}
  option dontlog-normal
{{- end }}
  option forwardfor
# never fail on address resolution
  default-server init-addr last,libc,none

peers local
  peer haproxy-0 haproxy-0:1024

frontend stats
  bind :32600
  option http-use-htx
  option dontlog-normal
  http-request use-service prometheus-exporter if { path /metrics }
  stats enable
  stats uri /
  stats refresh 20s

frontend https-in
  bind *:8433 accept-proxy
  mode http

{{- if .Values.config.mock.enabled }}
  acl host_mock hdr(host) -i {{ .Values.config.mock.address | default "mock.example.com" }}
  use_backend mock-servers if host_mock
{{- end }}

frontend http-in
  bind :8080 accept-proxy
  mode http
  redirect scheme https code 301 if !{ ssl_fc }

{{ if .Values.config.mock.enabled }}
backend mock-servers
  http-request set-header X-Real-IP %[src];
  http-request set-header X-Forwarded-For %[src];
  http-request set-header X-Forwarded-Proto %[src];
  http-request set-header Connection "upgrade"
  http-request set-header Host %[src]

  balance leastconn
  stick-table type string len 80 size 1m expire 8h peers local
# table mock-servers
  stick on url_param(id)

  option tcp-check
  {{ "{{-" }} range lookupSRV "http" "tcp" "{{ .Values.config.mock.name | default "mock" }}.{{ .Values.config.mock.namespace | default "default" }}.svc.cluster.local" {{ "}}" }}
  {{`server {{.Target}} {{.Target}}:{{.Port}}`}} check inter 5s downinter 10s fastinter 2s fall 5 on-marked-down shutdown-sessions
  {{`{{- end }}`}}
{{- end }}
