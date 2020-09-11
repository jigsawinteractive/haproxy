[template]
src = "haproxy.conf.tmpl"
dest = "/etc/haproxy/haproxy.conf"
uid = 0
gid = 0
mode = "0644"
keys = [
  "/haproxy",
  ]
# The command that should be used to check the syntax of the rendered configuration file.
check_cmd = "haproxy -f  {{`{{.src}}`}} -c"
# The command that should be used to reload the configuration of the application.
reload_cmd = "kill -USR2 `cat /etc/haproxy/haproxy.pid`"
