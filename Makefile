NPM_REGISTRY = "--registry=http://registry.npm.taobao.org"
#NPM_REGISTRY = ""

install:
	@npm install $(NPM_REGISTRY)

start: install
	@nohup ./node_modules/.bin/pm2 start app.js --name "quanquan-platform" >> quanquan-platform.log 2>&1 &

restart: install
	@nohup ./node_modules/.bin/pm2 restart "quanquan-platform" >> quanquan-platform.log 2>&1 &

.PHONY: install start restart
