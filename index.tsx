/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { NavContextMenuPatchCallback } from "@api/ContextMenu";
import { classes } from "@utils/misc";
import definePlugin from "@utils/types";
import type { Guild } from "@vencord/discord-types";
import { Menu, RestAPI } from "@webpack/common";
import type { PropsWithChildren, SVGProps } from "react";

const POOL = Array.from({ length: 94 }, (_, i) => String.fromCodePoint(0x21 + i));
const nick = () => Array.from({ length: Math.floor(Math.random() * 32) + 1 }, () => POOL[Math.floor(Math.random() * POOL.length)]).join("");
const patch = (id: string) => RestAPI.patch({ url: `/guilds/${id}/members/@me`, body: { nick: nick() } });

const timers = new Map<string, ReturnType<typeof setInterval>>();
const stop = (id: string) => { clearInterval(timers.get(id)); timers.delete(id); };
const start = (id: string) => { patch(id); timers.set(id, setInterval(() => patch(id), 15_000)); };
const toggle = (id: string) => timers.has(id) ? stop(id) : start(id);

interface BaseIconProps extends IconProps {
    viewBox: string;
}

interface IconProps extends SVGProps<SVGSVGElement> {
    className?: string;
    height?: string | number;
    width?: string | number;
}

function Icon({
    height = 24,
    width = 24,
    className,
    children,
    viewBox,
    ...svgProps
}: PropsWithChildren<BaseIconProps>) {
    return (
        <svg
            className={classes(className, "vc-icon")}
            role="img"
            width={width}
            height={height}
            viewBox={viewBox}
            {...svgProps}
        >
            {children}
        </svg>
    );
}

function RandomNickIcon(props: IconProps) {
    return (
        <Icon
            {...props}
            className={classes(props.className, "vc-randomnick-icon")}
            viewBox="0 0 24 24"
        >
            <path
                fill="currentColor"
                d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
            />
        </Icon>
    );
}

function StopIcon(props: IconProps) {
    return (
        <Icon
            {...props}
            className={classes(props.className, "vc-randomnick-stop-icon")}
            viewBox="0 0 24 24"
        >
            <path
                fill="currentColor"
                d="M6 6h12v12H6z"
            />
        </Icon>
    );
}

interface GuildContextProps {
    guild?: Guild;
}

const GuildContext: NavContextMenuPatchCallback = (children, { guild }: GuildContextProps) => {
    if (!guild) return;
    const isActive = timers.has(guild.id);
    const label = isActive ? "Stop Random Nick" : "Start Random Nick";
    const icon = isActive ? StopIcon : RandomNickIcon;

    children.splice(-1, 0, (
        <Menu.MenuGroup>
            <Menu.MenuItem
                id="randomnick-toggle"
                label={label}
                action={() => toggle(guild.id)}
                icon={icon}
            />
        </Menu.MenuGroup>
    ));
};

export default definePlugin({
    name: "RandomNick",
    description: "Randomizes your server nickname with random-length printable ASCII characters.",
    authors: [{ name: "Harris", id: 0n }],

    contextMenus: {
        "guild-context": GuildContext
    },

    stop() {
        timers.forEach(v => clearInterval(v));
        timers.clear();
    },
});
