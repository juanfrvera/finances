import { Subject } from "rxjs";
import type { Item } from "../typings";

export class ModalChannel {
    public static $channel = new Subject<ModalChannelSubject>
}

type ModalChannelSubject = iItemEdited;

interface iItemEdited { type: 'itemEdited', data: { item: Item } }