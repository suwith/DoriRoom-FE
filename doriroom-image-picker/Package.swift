// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "DoriroomImagePicker",
    platforms: [.iOS(.v14)],
    products: [
        .library(
            name: "DoriroomImagePicker",
            targets: ["DoriroomImagePickerPlugin"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", from: "7.0.0")
    ],
    targets: [
        .target(
            name: "DoriroomImagePickerPlugin",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm")
            ],
            path: "ios/Sources/DoriroomImagePickerPlugin"),
        .testTarget(
            name: "DoriroomImagePickerPluginTests",
            dependencies: ["DoriroomImagePickerPlugin"],
            path: "ios/Tests/DoriroomImagePickerPluginTests")
    ]
)