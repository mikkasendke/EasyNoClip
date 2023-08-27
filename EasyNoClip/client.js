import * as alt from "alt-client";
import * as native from "natives";

const toggle_key = 76; // L


alt.on("keyup", (key) => {
    if (key !== toggle_key) return;
    toggle();
});
alt.onServer("EasyNoClip:Notify", (message) => {
    Notify(message);
});

function Notify(message) {
    const textEntry = `TEXT_ENTRY_${(Math.random() * 1000).toFixed(0)}`;
    alt.addGxtText(textEntry, message);
    native.beginTextCommandThefeedPost("STRING");
    native.addTextComponentSubstringTextLabel(textEntry);
    native.endTextCommandThefeedPostTicker(false, false);
}

const noclip_camera_type = "DEFAULT_SCRIPTED_CAMERA";
let every_tick_id = 0;
let noclip_camera = -1;
let baseSpeedMultiplier = 10;
let is_enabled = false;

export function toggle() {
    is_enabled ? disable() : enable();
}
export function enable() {
    if (is_enabled) return;
    is_enabled = true;
    alt.emitServer("EasyNoClip:toggle", true);

    create_noclip_camera();
    set_collision(false);

    every_tick_id = alt.everyTick(on_tick);
}
export function disable() {
    if (!is_enabled) return;
    is_enabled = false;
    alt.emitServer("EasyNoClip:toggle", false);

    alt.clearEveryTick(every_tick_id);

    destroy_noclip_camera();
    set_collision(true);
}
function set_collision(enable) {
    native.freezeEntityPosition(alt.Player.local.scriptID, !enable);
    native.setEntityCollision(alt.Player.local.scriptID, enable, enable);
}
function create_noclip_camera() {
    const gameplayCamRot = native.getGameplayCamRot(2);

    noclip_camera = native.createCamWithParams(
        noclip_camera_type,
        alt.Player.local.pos.x,
        alt.Player.local.pos.y,
        alt.Player.local.pos.z,
        gameplayCamRot.x,
        gameplayCamRot.y,
        gameplayCamRot.z,
        native.getGameplayCamFov(),
        false,
        2
    );
    native.setCamActiveWithInterp(
        noclip_camera,
        native.getRenderingCam(),
        250,
        0,
        0
    );
    native.renderScriptCams(true, true, 500, true, false, 0);
}
function destroy_noclip_camera() {
    native.renderScriptCams(false, true, 500, true, false, 0);
    native.destroyCam(noclip_camera, true);
    noclip_camera = -1;
}

function on_tick() {
    disable_controls_this_tick();
    update_speed_multiplier_on_change();
    show_controls();

    const camera_position = get_camera_position();
    const camera_rotation = get_camera_rotation();

    set_camera_position(camera_position, camera_rotation);
    set_camera_rotation(camera_rotation);
}
function set_camera_rotation(camera_rotation) {
    const mouse_position_x = native.getDisabledControlNormal(1, 1);
    const mouse_position_y = native.getDisabledControlNormal(1, 2);
    const sensitivity = native.getProfileSetting(13);

    const rotation = {
        x: camera_rotation.x - mouse_position_y * sensitivity,
        y: camera_rotation.y,
        z: camera_rotation.z - mouse_position_x * sensitivity,
    };
    if (rotation.x >= 89) {
        rotation.x = 89;
    }
    if (rotation.x <= -89) {
        rotation.x = -89;
    }

    native.setCamRot(noclip_camera, rotation.x, 0, rotation.z, 2);
    // native.setGameplayCamRelativeRotation(rot.x, rot.y, rot.z);
    native.forceCameraRelativeHeadingAndPitch(rotation.x, 0, rotation.z);
    native.setEntityRotation(
        alt.Player.local.scriptID,
        rotation.x,
        0,
        rotation.z,
        2,
        true
    );
}
function show_controls() {
    const text = `~y~EasyNoClip\n~g~by Swox~w~\nSpeed: ~b~${baseSpeedMultiplier-1}`;
    native.beginTextCommandDisplayHelp("STRING");
    native.addTextComponentSubstringPlayerName(text);
    native.endTextCommandDisplayHelp(0, false, false, -1);
}
function set_camera_position(camera_position, camera_rotation) {
    const current_multiplier = native.isDisabledControlPressed(0, 21)
        ? baseSpeedMultiplier * 1.75
        : baseSpeedMultiplier;
    const offset = get_next_offset(camera_rotation).mul(
        current_multiplier * 0.25
    );
    const new_position = offset.add(camera_position);

    native.setCamCoord(
        noclip_camera,
        new_position.x,
        new_position.y,
        new_position.z
    );
    native.setEntityCoordsNoOffset(
        alt.Player.local.scriptID,
        new_position.x,
        new_position.y,
        new_position.z,
        false,
        false,
        false
    );
}
function update_speed_multiplier_on_change() {
    if (native.isDisabledControlPressed(0, 261) && baseSpeedMultiplier < 26) {
        baseSpeedMultiplier += 1;
    }
    if (native.isDisabledControlPressed(0, 262) && baseSpeedMultiplier > 2) {
        baseSpeedMultiplier -= 1;
    }
}
function disable_controls_this_tick() {
    native.disableControlAction(0, 0, true);
    native.disableControlAction(0, 1, true);
    native.disableControlAction(0, 2, true);
    native.disableControlAction(0, 14, true);
    native.disableControlAction(0, 15, true);
    native.disableControlAction(0, 24, true);
    native.disableControlAction(0, 25, true);
    native.disableControlAction(0, 30, true);
    native.disableControlAction(0, 31, true);
    native.disableControlAction(0, 32, true);
    native.disableControlAction(0, 33, true);
    native.disableControlAction(0, 34, true);
    native.disableControlAction(0, 49, true);

    native.disableControlAction(0, 37, true);
    native.disableControlAction(0, 53, true);
    native.disableControlAction(0, 54, true);
    native.disableControlAction(0, 56, true);
    native.disableControlAction(0, 56, true);
    native.disableControlAction(0, 56, true);

    native.disableControlAction(0, 157, true);
    native.disableControlAction(0, 158, true);
    native.disableControlAction(0, 159, true);
    native.disableControlAction(0, 160, true);
    native.disableControlAction(0, 161, true);
    native.disableControlAction(0, 162, true);
    native.disableControlAction(0, 163, true);
    native.disableControlAction(0, 164, true);
    native.disableControlAction(0, 165, true);

    native.disableControlAction(0, 261, true);
    native.disableControlAction(0, 262, true);
}

function get_next_offset(camera_rotation) {
    let offset = new alt.Vector3(0, 0, 0);

    // Forward (W)
    if (native.isDisabledControlPressed(0, 32)) {
        const forward = forward_vector_from_quaternion(
            euler_angles_to_quaternion(camera_rotation)
        );
        offset = offset.add(forward);
    }

    // Left (A)
    if (native.isDisabledControlPressed(0, 34)) {
        const left = forward_vector_from_quaternion(
            euler_angles_to_quaternion(
                new alt.Vector3(0, 0, camera_rotation.z - 270)
            )
        );
        offset = offset.add(left);
    }

    // Backward (S)
    if (native.isDisabledControlPressed(0, 33)) {
        let backwards = forward_vector_from_quaternion(
            euler_angles_to_quaternion(
                new alt.Vector3(
                    camera_rotation.x,
                    camera_rotation.y,
                    camera_rotation.z
                )
            )
        ).mul(-1);

        offset = offset.add(backwards);
    }

    // Right (D)
    if (native.isDisabledControlPressed(0, 35)) {
        let right = forward_vector_from_quaternion(
            euler_angles_to_quaternion(
                new alt.Vector3(0, 0, camera_rotation.z - 90)
            )
        );
        offset = offset.add(right);
    }

    // Up (Space)
    if (native.isDisabledControlPressed(0, 22)) {
        offset = offset.add(alt.Vector3.up);
    }

    // Down (Ctrl)
    if (native.isDisabledControlPressed(0, 36)) {
        offset = offset.add(alt.Vector3.down);
    }

    if (offset.x != 0 || offset.y != 0 || offset.z != 0) {
        offset = offset.normalize();
    }
    return offset;
}

function get_camera_position() {
    if (noclip_camera == -1) return native.getGameplayCamCoord();
    return native.getCamCoord(noclip_camera);
}
function get_camera_rotation() {
    if (noclip_camera == -1) return native.getGameplayCamRot(2);
    return native.getCamRot(noclip_camera, 2);
}

class Quaternion {
    constructor(x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
}
function euler_angles_to_quaternion(euler_angles) {
    const roll = euler_angles.x * (Math.PI / 180.0);
    const pitch = euler_angles.y * (Math.PI / 180.0);
    const yaw = euler_angles.z * (Math.PI / 180.0);

    const x =
        Math.sin(roll / 2) * Math.cos(pitch / 2) * Math.cos(yaw / 2) -
        Math.cos(roll / 2) * Math.sin(pitch / 2) * Math.sin(yaw / 2);
    const y =
        Math.cos(roll / 2) * Math.sin(pitch / 2) * Math.cos(yaw / 2) +
        Math.sin(roll / 2) * Math.cos(pitch / 2) * Math.sin(yaw / 2);
    const z =
        Math.cos(roll / 2) * Math.cos(pitch / 2) * Math.sin(yaw / 2) -
        Math.sin(roll / 2) * Math.sin(pitch / 2) * Math.cos(yaw / 2);
    const w =
        Math.cos(roll / 2) * Math.cos(pitch / 2) * Math.cos(yaw / 2) +
        Math.sin(roll / 2) * Math.sin(pitch / 2) * Math.sin(yaw / 2);

    return new Quaternion(x, y, z, w);
}

function forward_vector_from_quaternion(quaternion) {
    const q = quaternion;

    const x = 2 * (q.x * q.y - q.w * q.z);
    const y = 1 - 2 * (q.x * q.x + q.z * q.z);
    const z = 2 * (q.y * q.z + q.w * q.x);

    return new alt.Vector3(x, y, z);
}
