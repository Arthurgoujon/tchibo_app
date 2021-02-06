# note query parameters only work from browser <a> link I don't investigated why ... :)

adb shell am start -W -a android.intent.action.VIEW -d https://monkado.co.uk/appLink/coupon?id=ASgCA6zMrKvO1yBQ8s2C&key=2deb8366-5d5a-4eab-86f5-3b63c93cb088 com.blecoupon

# reverse port

adb reverse tcp:25600 tcp:25600

# delete cache (packager cache)

C:\Users\arthur.goujon\AppData\Local\Temp\metro-cache

# clean android project cache

cd android
.\gradlew clean

# build release

cd android
./gradlew bundleRelease
