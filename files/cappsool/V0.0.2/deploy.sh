export LC_ALL=en_US.UTF-8
export LANG=en_US.UTF-8
# aws s3 rm --recursive s3://cappbucket1/$1/
# aws s3 cp --recursive . s3://cappbucket1/$1

mkdir $2/files/cappsool/$1
cp -r ./* $2/files/cappsool/$1
pushd .
cd $2
git add  files/cappsool/$1/*
git commit -m ''$1''
git push https://github.com/cappsool/jsdelivr.git
popd
