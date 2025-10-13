import { Routes } from '@angular/router';
import { Home } from '../features/home/home';
import { MemberList } from '../features/member-list/member-list';
import { MemberDetailed } from '../features/member-detailed/member-detailed';
import { Lists } from '../features/lists/lists';
import { Messages } from '../features/messages/messages';
import { authGuard } from '../core/guards/auth-guard';
import { Testerrors } from '../features/testerrors/testerrors';
import { Notfound } from '../shared/notfound/notfound';
import { Servererror } from '../shared/servererror/servererror';
import { MemberProfile } from '../features/member-profile/member-profile';
import { MemberPhotos } from '../features/member-photos/member-photos';
import { MemberMessages } from '../features/member-messages/member-messages';
import { memberResolver } from '../features/resolvers/member-resolver';

export const routes: Routes = [
    { path: '', component: Home },
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [authGuard],
        children: [
            { path: 'members', component: MemberList },
            {
                path: 'members/:id', component: MemberDetailed,
                resolve: { member: memberResolver },
                runGuardsAndResolvers: 'always',
                children:
                    [
                        { path: "", redirectTo: "profile", pathMatch: "full" },
                        { path: "profile", component: MemberProfile, title: "Profile" },
                        { path: "photos", component: MemberPhotos, title: "Photos" },
                        { path: "messages", component: MemberMessages, title: "Messages" }
                    ]
            },
            { path: 'lists', component: Lists },
            { path: 'messages', component: Messages },
        ]
    },
    { path: "testerrors", component: Testerrors },
    { path: "server-error", component: Servererror },
    { path: '**', component: Notfound }
];
