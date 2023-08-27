import server from "alt-server";

server.on("playerConnect", (player) => {
    server.emitClient(
        player,
        "EasyNoClip:Notify",
        "~b~EasyNoClip by ~g~Swox~b~, press L to enter no clip."
    );
});

server.onClient("EasyNoClip:toggle", (player, isActive) => {
    player.visible = !isActive;
});
