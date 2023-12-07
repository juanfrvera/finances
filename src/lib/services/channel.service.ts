import { Subject } from "rxjs";
import type { ItemT } from "../typings";

export class ItemChannel {
    public static $channel = new Subject<ItemChannelSubject>
}

type ItemChannelSubject = iItemEdited;

interface iItemEdited { type: 'itemEdited', data: { item: ItemT } }