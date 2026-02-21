package com.hafizhbungo24.apppos

import android.content.Context
import android.hardware.display.DisplayManager
import android.view.Display
import android.view.WindowManager
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import android.os.Handler
import android.os.Looper

class DisplayManager(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private var customerPresentation: CustomerPresentation? = null
    private val mainHandler = Handler(Looper.getMainLooper())
    
    override fun getName(): String {
        return "DisplayManager"
    }

    @ReactMethod
    fun getDisplays(promise: Promise) {
        try {
            val displayManager = reactContext.getSystemService(Context.DISPLAY_SERVICE) as DisplayManager
            val displays = displayManager.displays
            val displaysArray = Arguments.createArray()
            
            displays.forEach { display ->
                val displayInfo = Arguments.createMap()
                displayInfo.putInt("id", display.displayId)
                displayInfo.putString("name", "Display ${display.displayId}")
                displayInfo.putInt("width", display.width)
                displayInfo.putInt("height", display.height)
                displayInfo.putBoolean("isPrimary", display.displayId == Display.DEFAULT_DISPLAY)
                displaysArray.pushMap(displayInfo)
            }
            
            promise.resolve(displaysArray)
        } catch (e: Exception) {
            promise.reject("DISPLAY_ERROR", "Failed to get displays", e)
        }
    }
    
    @ReactMethod
    fun showOnSecondaryDisplay(promise: Promise) {
        mainHandler.post {
            try {
                val displayManager = reactContext.getSystemService(Context.DISPLAY_SERVICE) as DisplayManager
                val displays = displayManager.displays
                
                if (displays.size > 1) {
                    val secondaryDisplay = displays.find { it.displayId != Display.DEFAULT_DISPLAY }
                    if (secondaryDisplay != null) {
                        if (customerPresentation == null) {
                            customerPresentation = CustomerPresentation(reactContext, secondaryDisplay)
                            customerPresentation?.show()
                            promise.resolve("Presentation shown on secondary display")
                        } else {
                            promise.resolve("Presentation already showing")
                        }
                    } else {
                        promise.reject("DISPLAY_ERROR", "No secondary display found")
                    }
                } else {
                    promise.reject("DISPLAY_ERROR", "Only one display found")
                }
            } catch (e: Exception) {
                promise.reject("DISPLAY_ERROR", "Failed to show presentation", e)
            }
        }
    }

    @ReactMethod
    fun updateCart(cartJson: String, promise: Promise) {
        mainHandler.post {
            try {
                if (customerPresentation == null) {
                    val displayManager = reactContext.getSystemService(Context.DISPLAY_SERVICE) as DisplayManager
                    val displays = displayManager.displays
                    val secondaryDisplay = displays.find { it.displayId != Display.DEFAULT_DISPLAY }
                    if (secondaryDisplay != null) {
                        customerPresentation = CustomerPresentation(reactContext, secondaryDisplay)
                        customerPresentation?.show()
                    }
                }
                
                customerPresentation?.updateCart(cartJson)
                promise.resolve("Cart updated")
            } catch (e: Exception) {
                promise.reject("DISPLAY_ERROR", "Failed to update cart", e)
            }
        }
    }

    @ReactMethod
    fun hidePresentation(promise: Promise) {
        mainHandler.post {
            customerPresentation?.dismiss()
            customerPresentation = null
            promise.resolve("Presentation hidden")
        }
    }
    
    @ReactMethod
    fun hasMultipleDisplays(promise: Promise) {
        try {
            val displayManager = reactContext.getSystemService(Context.DISPLAY_SERVICE) as DisplayManager
            val displays = displayManager.displays
            val hasMultiple = displays.size > 1
            
            promise.resolve(hasMultiple)
        } catch (e: Exception) {
            promise.reject("DISPLAY_ERROR", "Failed to check displays", e)
        }
    }
}
