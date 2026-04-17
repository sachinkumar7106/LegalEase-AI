import fs from 'fs';

const path = 'c:/Users/Sachin/OneDrive/Desktop/React/legalease-ai/legaleaseai/src/App.jsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  'const { logout } = useAuth();', 
  'const { user, logout } = useAuth();'
);

code = code.replace(
  '<div className="avatar">U</div>', 
  '<div className="avatar">{user?.email ? user.email[0].toUpperCase() : "U"}</div>'
);

code = code.replace(
  '<div style={{ fontSize: 12, color: COLORS.text, fontWeight: 500 }}>User Office</div>', 
  '<div style={{ fontSize: 12, color: COLORS.text, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: 140 }}>{user?.email || "User"}</div>'
);

fs.writeFileSync(path, code);
