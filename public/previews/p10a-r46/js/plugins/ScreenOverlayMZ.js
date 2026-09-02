/*:
 * @target MZ
 * @plugindesc 在屏幕上方显示覆盖图片，可指定显示场景并支持随机切换多张图片 v2.1
 * @author Daxx
 * @url 
 * 
 * @param overlayImages
 * @text 覆盖图片列表
 * @desc 显示在屏幕上方的图片文件名列表（放在img/system/文件夹）
 * @type file[]
 * @dir img/system/
 * @default []
 * 
 * @param targetScenes
 * @text 目标场景
 * @desc 在哪些场景显示图片
 * @type string[]
 * @default ["Map", "Menu"]
 * @option Boot
 * @option Title
 * @option Map
 * @option Menu
 * @option Item
 * @option Skill
 * @option Status
 * @option Options
 * @option Save
 * @option Load
 * @option GameEnd
 * @option Shop
 * @option Name
 * @option Debug
 * @option Battle
 * @option Gameover
 * @option Splash
 * @option Achievement
 * @option ParamDistribution
 * 
 * @param opacity
 * @text 不透明度
 * @desc 图片的不透明度（0-255）
 * @type number
 * @min 0
 * @max 255
 * @default 255
 * 
 * @param zIndex
 * @text 显示层级
 * @desc 图片的Z-index（数值越大越在上层）
 * @type number
 * @min 0
 * @max 9999
 * @default 999
 * 
 * @param xPosition
 * @text X坐标
 * @desc 图片的X坐标位置
 * @type number
 * @default 0
 * 
 * @param yPosition
 * @text Y坐标
 * @desc 图片的Y坐标位置
 * @type number
 * @default 0
 * 
 * @help
 * 使用说明：
 * 1. 将图片放入img/system/文件夹
 * 2. 在插件参数中设置图片文件名列表（可添加多个）
 * 3. 选择要在哪些场景显示
 * 4. 图片会自动在指定场景随机显示列表中的一张
 * 
 * 插件指令：
 *   ScreenOverlay show     - 显示覆盖图片（随机切换一张）
 *   ScreenOverlay hide     - 隐藏覆盖图片
 *   ScreenOverlay toggle   - 切换显示状态
 *   ScreenOverlay random   - 随机切换到另一张图片（保持显示状态）
 */

(function() {
    'use strict';

    // 读取插件参数
    const parameters = PluginManager.parameters('ScreenOverlayMZ');
    const overlayImages = JSON.parse(parameters['overlayImages'] || '[]');
    const targetScenes = JSON.parse(parameters['targetScenes'] || '["Map", "Menu"]');
    const opacity = Number(parameters['opacity'] || 255);
    const zIndex = Number(parameters['zIndex'] || 999);
    const xPosition = Number(parameters['xPosition'] || 0);
    const yPosition = Number(parameters['yPosition'] || 0);

    let _overlaySprite = null;
    let _isVisible = true;
    let _currentImageIndex = -1;
    let _currentSceneName = ''; // 记录当前场景名称，用于场景切换时才更新

    // 随机选择图片索引
    function getRandomImageIndex() {
        if (overlayImages.length === 0) return -1;
        if (overlayImages.length === 1) return 0;
        // 确保不会连续显示同一张图片
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * overlayImages.length);
        } while (newIndex === _currentImageIndex);
        _currentImageIndex = newIndex;
        return newIndex;
    }

    // 创建覆盖图片精灵
    function createOverlaySprite() {
        const imageIndex = getRandomImageIndex();
        if (imageIndex === -1) return null;
        
        const imageName = overlayImages[imageIndex];
        const sprite = new Sprite(ImageManager.loadSystem(imageName));
        sprite.x = xPosition;
        sprite.y = yPosition;
        sprite.opacity = opacity;
        sprite.z = zIndex;
        sprite.visible = _isVisible;
        
        return sprite;
    }

    // 检查当前场景是否需要显示
    function shouldShowInCurrentScene() {
        const scene = SceneManager._scene;
        if (!scene) return false;
        
        const sceneName = scene.constructor.name.replace('Scene_', '');
        return targetScenes.includes(sceneName);
    }

    // 获取当前场景名称
    function getCurrentSceneName() {
        const scene = SceneManager._scene;
        return scene ? scene.constructor.name.replace('Scene_', '') : '';
    }

    // 场景管理 - 修复闪烁问题：只在场景切换或需要更新时才重新创建
    const _SceneManager_updateScene = SceneManager.updateScene;
    SceneManager.updateScene = function() {
        _SceneManager_updateScene.call(this);
        const newSceneName = getCurrentSceneName();
        // 只有场景变化或当前没有精灵时才更新
        if (newSceneName !== _currentSceneName || !_overlaySprite) {
            _currentSceneName = newSceneName;
            this.updateOverlay();
        }
    };

    SceneManager.updateOverlay = function() {
        const scene = this._scene;
        if (!scene) return;
        
        // 移除旧的覆盖层
        if (_overlaySprite && scene.removeChild) {
            scene.removeChild(_overlaySprite);
            _overlaySprite = null;
        }
        
        // 如果需要显示且图片列表不为空，创建新的覆盖层
        if (shouldShowInCurrentScene() && overlayImages.length > 0) {
            _overlaySprite = createOverlaySprite();
            if (_overlaySprite) {
                scene.addChild(_overlaySprite);
            }
        }
    };

    // 插件指令处理
    PluginManager.registerCommand('ScreenOverlayMZ', 'show', function() {
        _isVisible = true;
        if (_overlaySprite) {
            _overlaySprite.visible = true;
        } else if (overlayImages.length > 0) {
            SceneManager.updateOverlay();
        }
        console.log('屏幕覆盖图片已显示');
    });

    PluginManager.registerCommand('ScreenOverlayMZ', 'hide', function() {
        _isVisible = false;
        if (_overlaySprite) {
            _overlaySprite.visible = false;
        }
        console.log('屏幕覆盖图片已隐藏');
    });

    PluginManager.registerCommand('ScreenOverlayMZ', 'toggle', function() {
        _isVisible = !_isVisible;
        if (_overlaySprite) {
            _overlaySprite.visible = _isVisible;
        } else if (_isVisible && overlayImages.length > 0) {
            SceneManager.updateOverlay();
        }
        console.log(`屏幕覆盖图片已${_isVisible ? '显示' : '隐藏'}`);
    });

    PluginManager.registerCommand('ScreenOverlayMZ', 'random', function() {
        if (overlayImages.length > 0 && _isVisible) {
            const scene = SceneManager._scene;
            if (_overlaySprite && scene.removeChild) {
                scene.removeChild(_overlaySprite);
            }
            _overlaySprite = createOverlaySprite();
            if (_overlaySprite) {
                _overlaySprite.visible = true;
                scene.addChild(_overlaySprite);
            }
            console.log('已随机切换覆盖图片');
        }
    });

    // 初始化
    const _Scene_Base_start = Scene_Base.prototype.start;
    Scene_Base.prototype.start = function() {
        _Scene_Base_start.call(this);
        _currentSceneName = getCurrentSceneName(); // 初始化当前场景名称
        SceneManager.updateOverlay();
    };

    console.log('ScreenOverlayMZ插件加载完成');
})();