/**
 * AppDelegate.swift — iOS Capacitor push notification template.
 *
 * Copy into ios/App/App/AppDelegate.swift and merge with existing Capacitor setup.
 * Ensures APNs device token is forwarded to Capacitor Push Notifications plugin.
 */

import UIKit
import Capacitor

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
    ) -> Bool {
        // Request authorization is typically handled from JS via @capacitor/push-notifications.
        // Register for remote notifications after permission granted.
        return true
    }

    func application(
        _ application: UIApplication,
        didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data
    ) {
        // Forward token to Capacitor
        NotificationCenter.default.post(
            name: .capacitorDidRegisterForRemoteNotifications,
            object: deviceToken
        )
    }

    func application(
        _ application: UIApplication,
        didFailToRegisterForRemoteNotificationsWithError error: Error
    ) {
        NotificationCenter.default.post(
            name: .capacitorDidFailToRegisterForRemoteNotifications,
            object: error
        )
    }
}