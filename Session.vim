let SessionLoad = 1
let s:so_save = &so | let s:siso_save = &siso | set so=0 siso=0
let v:this_session=expand("<sfile>:p")
silent only
cd ~/Documents/Projects/vip
if expand('%') == '' && !&modified && line('$') <= 1 && getline(1) == ''
  let s:wipebuf = bufnr('%')
endif
set shortmess=aoO
badd +1 package.json
badd +1 js/data/index.js
badd +1 js/data/linkedinProfileLinks.json
badd +195 js/server/index.js
badd +221 js/server/schema/index.js
badd +1 js/client/index.js
badd +29 js/client/components/index.js
badd +68 js/client/components/styles.css
badd +1 js/client/components/Profile/index.js
badd +1 js/client/components/Profile/Edges/index.js
badd +11 js/client/components/Profile/Edges/Node/index.js
badd +16 js/client/components/Profile/Edges/Node/Jumbotron/index.js
badd +1 js/client/components/Profile/Edges/Node/Jumbotron/ProfilePicture/index.js
badd +23 js/client/components/Profile/Edges/Node/Jumbotron/Text/index.js
badd +1 js/client/components/Profile/Edges/Node/Experience/index.js
badd +1 js/client/components/Profile/Edges/Node/Experience/Item/index.js
badd +1 js/client/components/Profile/Edges/Node/Education/index.js
badd +1 js/client/components/Profile/Edges/Node/Education/Item/index.js
badd +1 js/client/components/Profile/Edges/Node/Skill/index.js
badd +95 js/client/components/Profile/Detail/index.js
badd +77 js/client/components/Profile/Detail/Node/index.js
badd +1 js/client/components/Loading/index.js
badd +1 js/client/components/Navbar/index.js
badd +1 js/client/components/Empty/index.js
badd +1 js/client/components/Navbar/Auth/index.js
badd +1 js/client/components/Navbar/Auth/Sign/index.js
badd +13 js/client/components/Navbar/Auth/Sign/Signin/index.js
badd +1 js/client/components/Auth/index.js
badd +70 js/client/components/Auth/Signin/index.js
badd +1 js/client/mutations/UserSignin.js
badd +1 js/client/components/Navbar/Auth/User/index.js
badd +1 js/client/components/Navbar/Auth/User/Signout/index.js
badd +1 js/client/mutations/UserSignout.js
badd +27 js/client/components/Navbar/Auth/User/Profile/index.js
badd +1 js/client/components/Navbar/Auth/Sign/Signup.js
badd +1 js/client/components/Navbar/Auth/Sign/Signup/index.js
badd +72 js/client/components/Auth/Signup/index.js
badd +1 js/client/mutations/UserCreate.js
badd +15 js/server/mailer/index.js
badd +1 js/client/components/Auth/PasswordReset/index.js
badd +1 js/client/mutations/UserPasswordReset.js
badd +1 js/client/components/Profile/Detail/Node/Jumbotron/ProfilePicture/index.js
badd +19 js/client/components/Profile/Detail/Node/Jumbotron/Text/index.js
badd +1 js/client/components/Profile/Detail/Node/Jumbotron/Text/FullName/index.js
badd +28 js/client/components/Profile/Detail/Node/Jumbotron/index.js
badd +1 js/client/components/Profile/Detail/Node/Jumbotron/Text/FullName/Update/index.js
badd +1 js/client/components/Profile/Detail/Node/Jumbotron/Text/FullName/Display/index.js
badd +1 js/client/components/Profile/Detail/Node/Jumbotron/Text/Display/index.js
badd +184 js/client/components/Profile/Detail/Node/Jumbotron/Text/Update/index.js
badd +1 js/client/components/Profile/Detail/Node/Jumbotron/Text/Controls/index.js
badd +1 js/client/components/Profile/Detail/Node/Jumbotron/Text/Controls/Update/index.js
badd +30 webpack.config.dev.js
badd +1 webpack.config.prod.js
badd +1 js/client/mutations/ProfileUpdate.js
badd +1 js/data/profileProcess.js
badd +1 js/client/components/Footer/index.js
badd +1 js/client/components/Navbar/Auth/User/Account/index.js
badd +1 js/client/components/Auth/Account/index.js
badd +1 js/client/components/Auth/User/index.js
badd +1 js/client/components/Auth/User/update/index.js
badd +1 js/client/components/Auth/User/Update/index.js
badd +1 js/client/mutations/UserUpdate.js
badd +1 js/client/components/Auth/User/Delete/index.js
badd +1 js/client/mutations/UserDelete.js
badd +84 js/client/components/Profile/Detail/Node/Experience/index.js
badd +1 js/client/components/Profile/Detail/Node/Experience/Item/index.js
badd +6 js/client/components/Profile/Detail/Node/Experience/Controls/index.js
badd +10 js/client/components/Profile/Detail/Node/Experience/Controls/Create/index.js
badd +210 js/client/components/Profile/Detail/Node/Experience/Create/index.js
badd +7 js/client/components/Profile/Detail/Node/Experience/Create/SinceUntil/index.js
badd +49 ~/.vimrc
badd +1 js/client/components/Profile/Detail/Node/Experience/Create/SinceUntil/MonthBox/index.js
badd +1 js/client/vendor.bundle.scss
badd +1 js/client/month-picker.scss
badd +1 js/client/components/BootstrapDatepicker/index.js
badd +1 js/client/mutations/ProfileExperienceCreate.js
badd +1 js/client/components/Profile/Detail/Node/Experience/Item/Controls/index.js
badd +1 js/client/components/Profile/Detail/Node/Experience/Controls/Delete/index.js
badd +1 js/client/components/Profile/Detail/Node/Experience/Item/Controls/Delete/index.js
badd +1 js/client/mutations/ProfileExperienceDelete.js
badd +1 js/client/components/Profile/Detail/Node/Experience/Item/Controls/Update/index.js
badd +1 js/client/components/Profile/Detail/Node/Experience/Item/Display/index.js
badd +270 js/client/components/Profile/Detail/Node/Experience/Item/Update/index.js
badd +1 js/client/mutations/ProfileExperienceUpdate.js
badd +23 js/client/components/Profile/Detail/Node/Education/index.js
badd +50 js/client/components/Profile/Detail/Node/Education/Item/index.js
badd +29 js/client/components/Profile/Detail/Node/Education/Item/Display/index.js
badd +1 js/client/components/Profile/Detail/Node/Education/Controls/index.js
badd +1 js/client/components/Profile/Detail/Node/Education/Controls/Create/index.js
badd +1 js/client/components/Profile/Detail/Node/Education/Create/index.js
badd +1 js/client/mutations/ProfileEducationCreate.js
badd +1 js/client/components/Profile/Detail/Node/Education/Item/Controls/index.js
badd +1 js/client/components/Profile/Detail/Node/Education/Item/Controls/Delete/index.js
badd +1 js/client/mutations/ProfileEducationDelete.js
badd +1 js/client/components/Profile/Detail/Node/Education/Item/Controls/Update/index.js
badd +1 js/client/components/Profile/Detail/Node/Education/Item/Update/index.js
badd +1 js/client/mutations/ProfileEducationUpdate.js
badd +1 js/client/components/Profile/Detail/Node/Skill/index.js
badd +1 js/client/components/Profile/Detail/Node/Skill/Create/index.js
badd +1 js/client/components/Profile/Detail/Node/Skill/Item/index.js
badd +1 js/client/components/Profile/Detail/Node/Skill/Controls/index.js
badd +1 js/client/components/Profile/Detail/Node/Skill/Controls/Create/index.js
badd +1 js/client/components/Profile/Detail/Node/Skill/Item/Display/index.js
badd +1 js/client/components/Profile/Detail/Node/Skill/Item/Update/index.js
badd +1 js/client/components/Profile/Detail/Node/Skill/Item/Controls/index.js
badd +1 js/client/components/Profile/Detail/Node/Skill/Item/Controls/Delete/index.js
badd +1 js/client/mutations/ProfileSkillDelete.js
badd +1 js/client/mutations/ProfileSkillCreate.js
badd +1 js/client/components/Profile/Detail/Node/Jumbotron/ProfilePicture/Display/index.js
badd +1 js/client/components/Profile/Detail/Node/Jumbotron/ProfilePicture/Controls/index.js
badd +1 js/client/components/Profile/Detail/Node/Jumbotron/ProfilePicture/Controls/Update/index.js
badd +1 js/client/mutations/ProfilePictureUpdate.js
argglobal
silent! argdel *
edit package.json
set splitbelow splitright
set nosplitbelow
set nosplitright
wincmd t
set winheight=1 winwidth=1
argglobal
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let s:l = 1 - ((0 * winheight(0) + 24) / 48)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
1
normal! 0
tabedit js/data/profileProcess.js
set splitbelow splitright
set nosplitbelow
set nosplitright
wincmd t
set winheight=1 winwidth=1
argglobal
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let s:l = 2 - ((1 * winheight(0) + 24) / 48)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
2
normal! 0
tabedit js/server/index.js
set splitbelow splitright
set nosplitbelow
set nosplitright
wincmd t
set winheight=1 winwidth=1
argglobal
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let s:l = 185 - ((19 * winheight(0) + 24) / 48)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
185
normal! 07|
tabedit js/server/schema/index.js
set splitbelow splitright
set nosplitbelow
set nosplitright
wincmd t
set winheight=1 winwidth=1
argglobal
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let s:l = 258 - ((37 * winheight(0) + 24) / 48)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
258
normal! 0
tabedit js/client/index.js
set splitbelow splitright
set nosplitbelow
set nosplitright
wincmd t
set winheight=1 winwidth=1
argglobal
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let s:l = 18 - ((16 * winheight(0) + 24) / 48)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
18
normal! 018|
tabedit js/client/components/index.js
set splitbelow splitright
set nosplitbelow
set nosplitright
wincmd t
set winheight=1 winwidth=1
argglobal
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let s:l = 28 - ((26 * winheight(0) + 24) / 48)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
28
normal! 04|
tabedit js/client/components/Profile/Detail/index.js
set splitbelow splitright
set nosplitbelow
set nosplitright
wincmd t
set winheight=1 winwidth=1
argglobal
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let s:l = 79 - ((47 * winheight(0) + 24) / 48)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
79
normal! 0
tabedit js/client/components/Profile/Detail/Node/index.js
set splitbelow splitright
set nosplitbelow
set nosplitright
wincmd t
set winheight=1 winwidth=1
argglobal
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let s:l = 77 - ((47 * winheight(0) + 24) / 48)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
77
normal! 09|
tabedit js/client/components/Profile/Detail/Node/Jumbotron/index.js
set splitbelow splitright
set nosplitbelow
set nosplitright
wincmd t
set winheight=1 winwidth=1
argglobal
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let s:l = 16 - ((8 * winheight(0) + 24) / 48)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
16
normal! 05|
tabedit js/client/components/Profile/Detail/Node/Jumbotron/ProfilePicture/index.js
set splitbelow splitright
set nosplitbelow
set nosplitright
wincmd t
set winheight=1 winwidth=1
argglobal
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let s:l = 21 - ((15 * winheight(0) + 24) / 48)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
21
normal! 019|
tabedit js/client/components/Profile/Detail/Node/Jumbotron/ProfilePicture/Controls/index.js
set splitbelow splitright
set nosplitbelow
set nosplitright
wincmd t
set winheight=1 winwidth=1
argglobal
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let s:l = 14 - ((12 * winheight(0) + 24) / 48)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
14
normal! 053|
tabedit js/client/components/Profile/Detail/Node/Jumbotron/ProfilePicture/Controls/Update/index.js
set splitbelow splitright
set nosplitbelow
set nosplitright
wincmd t
set winheight=1 winwidth=1
argglobal
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let s:l = 13 - ((7 * winheight(0) + 24) / 48)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
13
normal! 034|
tabedit js/client/mutations/ProfilePictureUpdate.js
set splitbelow splitright
set nosplitbelow
set nosplitright
wincmd t
set winheight=1 winwidth=1
argglobal
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let s:l = 36 - ((34 * winheight(0) + 24) / 48)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
36
normal! 05|
tabedit js/client/components/Profile/Detail/Node/Jumbotron/ProfilePicture/Display/index.js
set splitbelow splitright
set nosplitbelow
set nosplitright
wincmd t
set winheight=1 winwidth=1
argglobal
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let s:l = 12 - ((11 * winheight(0) + 24) / 48)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
12
normal! 0
tabedit js/client/components/styles.css
set splitbelow splitright
set nosplitbelow
set nosplitright
wincmd t
set winheight=1 winwidth=1
argglobal
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let s:l = 52 - ((36 * winheight(0) + 24) / 48)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
52
normal! 025|
tabnext 1
if exists('s:wipebuf') && getbufvar(s:wipebuf, '&buftype') isnot# 'terminal'
  silent exe 'bwipe ' . s:wipebuf
endif
unlet! s:wipebuf
set winheight=1 winwidth=20 shortmess=filnxtToO
let s:sx = expand("<sfile>:p:r")."x.vim"
if file_readable(s:sx)
  exe "source " . fnameescape(s:sx)
endif
let &so = s:so_save | let &siso = s:siso_save
let g:this_session = v:this_session
let g:this_obsession = v:this_session
let g:this_obsession_status = 2
doautoall SessionLoadPost
unlet SessionLoad
" vim: set ft=vim :
