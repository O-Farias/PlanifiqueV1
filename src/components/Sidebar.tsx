import React from "react";
import { useSidebar } from "../contexts/SidebarContext";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate, useLocation } from "react-router-dom";

interface SidebarProps {
  drawerWidth: number;
  onLogout: () => Promise<void>;
}

const Sidebar: React.FC<SidebarProps> = ({ drawerWidth, onLogout }) => {
  const { isOpen, toggleSidebar } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();
  const [openLogoutDialog, setOpenLogoutDialog] = React.useState(false);

  const handleOpenLogoutDialog = () => {
    setOpenLogoutDialog(true);
  };

  const handleCloseLogoutDialog = () => {
    setOpenLogoutDialog(false);
  };

  const menuItems = [
    {
      text: "Dashboard",
      icon: <InsertChartOutlinedIcon sx={{ color: "#1976d2" }} />,
      onClick: () => navigate("/dashboard"),
      path: "/dashboard",
    },
    {
      text: "Categorias",
      icon: <ListAltIcon sx={{ color: "red" }} />,
      onClick: () => navigate("/categorias"),
      path: "/categorias",
    },
    {
      text: "Perfil",
      icon: <PersonIcon sx={{ color: "purple" }} />,
      onClick: () => navigate("/perfil"),
      path: "/perfil",
    },
    {
      text: "Sair",
      icon: <LogoutIcon sx={{ color: "gray" }} />,
      onClick: handleOpenLogoutDialog,
      path: "",
    },
  ];

  return (
    <>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={isOpen}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "0 8px",
          }}
        >
          <IconButton onClick={toggleSidebar}>
            <ChevronLeftIcon />
          </IconButton>
        </Box>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={item.onClick}
                selected={location.pathname === item.path}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Dialog
        open={openLogoutDialog}
        onClose={handleCloseLogoutDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirmar saída"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Tem certeza que deseja sair? Você será redirecionado para a página
            de login.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLogoutDialog}>Cancelar</Button>
          <Button
            onClick={async () => {
              handleCloseLogoutDialog();
              await onLogout();
            }}
            autoFocus
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Sidebar;
