#!/bin/bash
echo "Choose your deployment environment:"
select ENV in local production
#doからdoneまでループ処理
do
	break
done
echo "Execute deploy process in ${ENV} environment!"

case $ENV in
  "local" ) {
    echo "Deploying to local environment..."
    export DFX_NETWORK=${ENV}
    target_canister="internet_identity_div"
    upper_case=$(echo $target_canister | tr 'a-z' 'A-Z')

    dfx deploy $target_canister
    dfx generate $target_canister
    sed -i -e "s/${upper_case}_CANISTER_ID/NEXT_PUBLIC_${upper_case}_CANISTER_ID/" src/declarations/$target_canister/index.js
  } ;;
  "production" ) {
    echo "Deploying to production environment..."
    export DFX_NETWORK="ic"
  } ;;
esac

npm install
npm run deploy

case $ENV in
  "local" ) {
    dfx deploy MyApp
  } ;;
"production" ) {
    dfx deploy MyApp --network ic
  } ;;
esac