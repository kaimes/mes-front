#!/bin/bash

set -xe
origin_tag_name=$1
# 要打包的本地镜像 tag
local_tag="easydispatch-front:local"
# 远程仓库 url 
remote_url="easydispatch-container-reg-registry.ap-southeast-1.cr.aliyuncs.com/easydispatch-yun-test/easydispatch-frontend"
# 要使用的dockerfile 文件地址 
docker_file="./k8s/Dockerfile.webui"

docker build -t ${local_tag} -f ${docker_file} .
docker tag ${local_tag} ${remote_url}:${origin_tag_name}
docker push ${remote_url}:${origin_tag_name}


# 历史编译记录
# branchName+ 日期+ 第几次编译
# bash k8s/build_images/build.sh ed-front-0129



# bash k8s/build_images/build.sh satlock-0529

# bash k8s/build_images/build.sh satlock-0531



# bash k8s/build_images/build.sh satlock-0605
